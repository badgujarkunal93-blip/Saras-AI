'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  FirebaseUser,
} from './firebase';
import {
  DemoUser,
  AuthSession,
  getLocalSession,
  getLocalUsers,
  setLocalSession,
  clearLocalSession,
  localSignIn,
  localSignUp,
  localQuickLogin,
  saveLocalUsers,
  SEED_DEMO_USERS,
} from './localAuth';

export interface AuthUser extends DemoUser {
  firebaseUid?: string;
  isFirebase?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  demoUsers: DemoUser[];
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password?: string;
    learningTrack?: string;
    avatarBg?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  quickLogin: (userId: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  refreshUsers: () => void;
  isFirebaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoUsers, setDemoUsers] = useState<DemoUser[]>(SEED_DEMO_USERS);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(true);

  const refreshUsers = () => {
    setDemoUsers(getLocalUsers());
  };

  // Helper to sync user profile with database
  const syncUserToDb = async (authUser: AuthUser) => {
    try {
      await fetch('/api/user/summary', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authUser.id,
          name: authUser.name,
          email: authUser.email,
          avatarUrl: authUser.avatarBg,
        }),
      });
    } catch (e) {
      // Non-fatal if offline
    }
  };

  useEffect(() => {
    setDemoUsers(getLocalUsers());

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        // Authenticated via Firebase
        const savedTrack = typeof window !== 'undefined' ? localStorage.getItem(`track_${fbUser.uid}`) : null;
        const savedColor = typeof window !== 'undefined' ? localStorage.getItem(`color_${fbUser.uid}`) : null;

        const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Learner';
        const initials = displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2) || 'LR';

        const firebaseAuthUser: AuthUser = {
          id: fbUser.uid,
          firebaseUid: fbUser.uid,
          isFirebase: true,
          name: displayName,
          email: fbUser.email || '',
          role: 'Active Learner',
          learningTrack: savedTrack || 'AI & Machine Learning',
          avatarBg: savedColor || '#B8FF3D',
          initials,
          createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          bio: 'Building mastery with AI video checkpoints and active recall.',
        };

        setUser(firebaseAuthUser);
        const fbSession: AuthSession = {
          user: firebaseAuthUser,
          token: await fbUser.getIdToken().catch(() => 'firebase_token'),
          expiresAt: new Date(Date.now() + 86400 * 1000 * 7).toISOString(),
        };
        setSession(fbSession);
        setLocalSession(firebaseAuthUser);
        setIsLoading(false);
        syncUserToDb(firebaseAuthUser);
      } else {
        // Check for local storage mock session fallback (e.g. quick demo accounts)
        try {
          const activeSession = getLocalSession();
          if (activeSession && !activeSession.user.id.startsWith('firebase_')) {
            setSession(activeSession);
            setUser(activeSession.user);
          } else {
            setUser(null);
            setSession(null);
          }
        } catch (e) {
          console.error('Failed to load local auth session:', e);
        } finally {
          setIsLoading(false);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Real Firebase Email/Password Sign In
  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      if (!password) {
        // Fallback for quick login
        const res = localSignIn(email);
        setIsLoading(false);
        if (res.success && res.user) {
          setUser(res.user);
          setSession(getLocalSession());
          return { success: true };
        }
        return { success: false, error: res.error || 'Failed to sign in.' };
      }

      const credential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = credential.user;
      const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Learner';
      const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'LR';

      const authUser: AuthUser = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        isFirebase: true,
        name: displayName,
        email: fbUser.email || email,
        role: 'Active Learner',
        learningTrack: localStorage.getItem(`track_${fbUser.uid}`) || 'AI & Machine Learning',
        avatarBg: localStorage.getItem(`color_${fbUser.uid}`) || '#B8FF3D',
        initials,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };

      setUser(authUser);
      setLocalSession(authUser);
      setIsLoading(false);
      syncUserToDb(authUser);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      console.warn('[Firebase Auth Login Error]:', err);
      let errorMsg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Too many failed login attempts. Please reset your password or try again later.';
      }
      return { success: false, error: errorMsg };
    }
  };

  // Real Firebase Sign Up with Display Name & Profile Settings
  const signup = async (data: {
    name: string;
    email: string;
    password?: string;
    learningTrack?: string;
    avatarBg?: string;
  }) => {
    setIsLoading(true);
    try {
      const pwd = data.password || 'password123';
      const credential = await createUserWithEmailAndPassword(auth, data.email, pwd);
      const fbUser = credential.user;

      // Update Firebase Profile displayName
      if (data.name) {
        await updateProfile(fbUser, { displayName: data.name });
      }

      if (data.learningTrack && typeof window !== 'undefined') {
        localStorage.setItem(`track_${fbUser.uid}`, data.learningTrack);
      }
      if (data.avatarBg && typeof window !== 'undefined') {
        localStorage.setItem(`color_${fbUser.uid}`, data.avatarBg);
      }

      const initials = (data.name || data.email || 'LR')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const authUser: AuthUser = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        isFirebase: true,
        name: data.name || fbUser.email?.split('@')[0] || 'Learner',
        email: fbUser.email || data.email,
        role: 'Active Learner',
        learningTrack: data.learningTrack || 'AI & Machine Learning',
        avatarBg: data.avatarBg || '#B8FF3D',
        initials,
        createdAt: new Date().toISOString(),
      };

      setUser(authUser);
      setLocalSession(authUser);
      setIsLoading(false);
      syncUserToDb(authUser);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      console.warn('[Firebase Auth SignUp Error]:', err);
      let errorMsg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'An account with this email already exists. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      }
      return { success: false, error: errorMsg };
    }
  };

  // Real Firebase Google Sign-In (Popup)
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const credential = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = credential.user;
      const displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Google Learner';
      const initials = displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'GL';

      const authUser: AuthUser = {
        id: fbUser.uid,
        firebaseUid: fbUser.uid,
        isFirebase: true,
        name: displayName,
        email: fbUser.email || '',
        role: 'Active Learner',
        learningTrack: 'AI & Machine Learning',
        avatarBg: '#B8FF3D',
        initials,
        createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
      };

      setUser(authUser);
      setLocalSession(authUser);
      setIsLoading(false);
      syncUserToDb(authUser);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      console.warn('[Firebase Google Auth Error]:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign in popup was closed.' };
      }
      return { success: false, error: err.message || 'Failed to sign in with Google.' };
    }
  };

  // Quick Demo account switcher
  const quickLogin = async (userId: string) => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } catch (e) {}

    await new Promise((res) => setTimeout(res, 200));
    const res = localQuickLogin(userId);
    setIsLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      setSession(getLocalSession());
      refreshUsers();
      syncUserToDb(res.user);
      return { success: true };
    }
    return { success: false, error: res.error || 'Quick login failed.' };
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    clearLocalSession();
    setUser(null);
    setSession(null);
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setLocalSession(updatedUser);
    syncUserToDb(updatedUser);

    if (user.id) {
      if (updates.learningTrack && typeof window !== 'undefined') {
        localStorage.setItem(`track_${user.id}`, updates.learningTrack);
      }
      if (updates.avatarBg && typeof window !== 'undefined') {
        localStorage.setItem(`color_${user.id}`, updates.avatarBg);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        demoUsers,
        login,
        signup,
        loginWithGoogle,
        quickLogin,
        logout,
        updateUser,
        refreshUsers,
        isFirebaseActive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
