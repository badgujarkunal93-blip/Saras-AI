// lib/auth/localAuth.ts
// LocalStorage-based Mock Auth engine for Saras AI Demo

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  learningTrack: string;
  avatarBg: string;
  initials: string;
  createdAt: string;
  bio?: string;
}

export interface AuthSession {
  user: DemoUser;
  token: string;
  expiresAt: string;
}

const STORAGE_USERS_KEY = 'saras_demo_users';
const STORAGE_SESSION_KEY = 'saras_auth_session';

export const SEED_DEMO_USERS: DemoUser[] = [
  {
    id: 'kunal_badgujar',
    name: 'Kunal Badgujar',
    email: 'kunal@saras.ai',
    password: 'password123',
    role: 'AI Engineer & Builder',
    learningTrack: 'AI & Deep Learning',
    avatarBg: '#B8FF3D', // Neon Lime
    initials: 'KB',
    createdAt: '2026-01-15T10:00:00Z',
    bio: 'Building autonomous learning workflows and deep reasoning agents.',
  },
  {
    id: 'alex_chen',
    name: 'Alex Chen',
    email: 'alex@saras.ai',
    password: 'password123',
    role: 'Computer Science Undergraduate',
    learningTrack: 'CS & Algorithms',
    avatarBg: '#DCEEFF', // Sky Blue
    initials: 'AC',
    createdAt: '2026-02-01T14:30:00Z',
    bio: 'Preparing for technical interviews and competitive programming.',
  },
  {
    id: 'maya_patel',
    name: 'Maya Patel',
    email: 'maya@saras.ai',
    password: 'password123',
    role: 'Full-Stack Developer',
    learningTrack: 'System Design & React',
    avatarBg: '#E9DFFF', // Lavender
    initials: 'MP',
    createdAt: '2026-02-18T09:15:00Z',
    bio: 'Mastering distributed systems, cloud primitives, and Next.js 14.',
  },
  {
    id: 'guest_student',
    name: 'Guest Learner',
    email: 'guest@saras.ai',
    password: 'password123',
    role: 'Lifelong Learner',
    learningTrack: 'Exploratory Learning',
    avatarBg: '#FFFDF7', // Cream
    initials: 'GL',
    createdAt: '2026-03-01T12:00:00Z',
    bio: 'Exploring interactive AI video segmentation and smart flashcards.',
  },
];

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Initialize or get all registered users from local storage
 */
export function getLocalUsers(): DemoUser[] {
  if (!isBrowser()) return SEED_DEMO_USERS;

  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_DEMO_USERS));
      return SEED_DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(SEED_DEMO_USERS));
      return SEED_DEMO_USERS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading local demo users:', err);
    return SEED_DEMO_USERS;
  }
}

/**
 * Save users list to local storage
 */
export function saveLocalUsers(users: DemoUser[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving local demo users:', err);
  }
}

/**
 * Get current active session
 */
export function getLocalSession(): AuthSession | null {
  if (!isBrowser()) return null;

  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) {
      // Default to first demo user (Kunal) so app never breaks in demo mode
      const defaultUser = SEED_DEMO_USERS[0];
      const session: AuthSession = {
        user: defaultUser,
        token: `demo_token_${defaultUser.id}_${Date.now()}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      return session;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error getting local session:', err);
    return null;
  }
}

/**
 * Set active user session and broadcast event
 */
export function setLocalSession(user: DemoUser): AuthSession {
  const session: AuthSession = {
    user,
    token: `demo_token_${user.id}_${Date.now()}`,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
      window.dispatchEvent(new CustomEvent('saras-auth-change', { detail: session }));
    } catch (err) {
      console.error('Error saving session:', err);
    }
  }

  return session;
}

/**
 * Remove active session
 */
export function clearLocalSession(): void {
  if (isBrowser()) {
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      window.dispatchEvent(new CustomEvent('saras-auth-change', { detail: null }));
    } catch (err) {
      console.error('Error clearing session:', err);
    }
  }
}

/**
 * Sign In with email and password
 */
export function localSignIn(email: string, password?: string): { success: boolean; user?: DemoUser; error?: string } {
  const users = getLocalUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      error: `No demo account found with email "${email}". Try one of the Quick Demo profiles or create a new account!`,
    };
  }

  // If password provided and user has a password, verify it
  if (password && user.password && user.password !== password) {
    return {
      success: false,
      error: 'Invalid password. (Tip: for demo accounts, password is "password123")',
    };
  }

  setLocalSession(user);
  return { success: true, user };
}

/**
 * Sign Up new demo account
 */
export function localSignUp(data: {
  name: string;
  email: string;
  password?: string;
  learningTrack?: string;
  avatarBg?: string;
}): { success: boolean; user?: DemoUser; error?: string } {
  const users = getLocalUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  if (!data.name.trim()) {
    return { success: false, error: 'Please enter your full name.' };
  }

  if (!normalizedEmail || !normalizedEmail.includes('@')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please sign in or use a different email.',
    };
  }

  const initials = data.name
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'ST';

  const newUser: DemoUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.password || 'password123',
    role: 'Student',
    learningTrack: data.learningTrack || 'General Learning',
    avatarBg: data.avatarBg || '#B8FF3D',
    initials,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [newUser, ...users];
  saveLocalUsers(updatedUsers);
  setLocalSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Quick 1-click login for demo profiles
 */
export function localQuickLogin(userId: string): { success: boolean; user?: DemoUser; error?: string } {
  const users = getLocalUsers();
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return { success: false, error: 'Selected demo user was not found.' };
  }

  setLocalSession(user);
  return { success: true, user };
}
