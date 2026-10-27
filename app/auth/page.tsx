'use client';

import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Flame,
  Zap,
  ShieldCheck,
  Layers,
  GraduationCap,
  ChevronRight,
  Check,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

const LEARNING_TRACKS = [
  { id: 'ai', label: 'AI & Machine Learning', icon: '🧠', color: '#B8FF3D' },
  { id: 'fullstack', label: 'Full-Stack & Systems', icon: '⚡', color: '#E9DFFF' },
  { id: 'cs', label: 'Algorithms & CS Core', icon: '📐', color: '#DCEEFF' },
  { id: 'exam', label: 'Exam & Interview Prep', icon: '🎯', color: '#FFFDF7' },
];

const AVATAR_COLORS = [
  { hex: '#B8FF3D', label: 'Lime' },
  { hex: '#E9DFFF', label: 'Lavender' },
  { hex: '#DCEEFF', label: 'Sky' },
  { hex: '#FFD1C7', label: 'Coral' },
  { hex: '#FFFDF7', label: 'Paper' },
];

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, signup, loginWithGoogle, quickLogin, demoUsers } = useAuth();

  // Mode: 'signin' or 'signup'
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState('AI & Machine Learning');
  const [selectedColor, setSelectedColor] = useState('#B8FF3D');

  // UI status
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode with search param if changed
  useEffect(() => {
    const qMode = searchParams.get('mode');
    if (qMode === 'signup') setMode('signup');
    else if (qMode === 'signin' || qMode === 'login') setMode('signin');
  }, [searchParams]);

  // Handle Google Sign-in
  const handleGoogleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setError(res.error || 'Google sign-in was cancelled.');
        setIsSubmitting(false);
        return;
      }
      setSuccessMessage('Authenticated with Google! Redirecting...');
      setTimeout(() => {
        router.push('/discover');
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Failed to sign in with Google.');
      setIsSubmitting(false);
    }
  };

  // Handle Sign In submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(signInEmail, signInPassword);
      if (!res.success) {
        setError(res.error || 'Failed to sign in.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Welcome back! Redirecting to workspace...');
      setTimeout(() => {
        router.push('/discover');
      }, 500);
    } catch (err: any) {
      setError(err?.message || 'Something went wrong during sign in.');
      setIsSubmitting(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!signUpName.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!signUpEmail.trim() || !signUpEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!signUpPassword || signUpPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        password: signUpPassword,
        learningTrack: selectedTrack,
        avatarBg: selectedColor,
      });

      if (!res.success) {
        setError(res.error || 'Failed to create account.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Account created successfully! Preparing your studio...');
      setTimeout(() => {
        router.push('/discover');
      }, 600);
    } catch (err: any) {
      setError(err?.message || 'Failed to create account.');
      setIsSubmitting(false);
    }
  };

  // Handle 1-click Quick Demo login
  const handleQuickDemoClick = async (demoUserId: string, name: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await quickLogin(demoUserId);
      if (!res.success) {
        setError(res.error || 'Failed to switch demo profile.');
        setIsSubmitting(false);
        return;
      }
      setSuccessMessage(`Logged in as ${name}! Redirecting...`);
      setTimeout(() => {
        router.push('/discover');
      }, 400);
    } catch (err) {
      setError('Quick login failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3EC] text-[#111218] flex flex-col justify-between selection:bg-[#B8FF3D] selection:text-[#111218]">
      {/* ─────────────────────────────────────────────────────────────
          TOP BRAND STRIP & BREADCRUMB
      ───────────────────────────────────────────────────────────── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
        <NextLink href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-[#B8FF3D] border-2 border-[#111218] shadow-neo-sm flex items-center justify-center group-hover:-translate-y-0.5 transition-all">
            <Sparkles className="w-5 h-5 text-[#111218] fill-[#111218]" />
          </div>
          <div className="flex items-center">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#111218]">
              Saras<span className="text-[#111218] bg-[#B8FF3D] px-1.5 py-0.5 rounded ml-1 border border-[#111218] text-xs font-black">AI</span>
            </span>
          </div>
        </NextLink>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B8FF3D] border border-[#111218] text-[11px] font-mono font-bold text-[#111218] shadow-neo-sm">
            <Flame className="w-3.5 h-3.5 fill-[#111218] text-[#111218]" />
            <span>Firebase Auth Active</span>
          </div>
          <NextLink
            href="/"
            className="text-xs font-bold font-display uppercase tracking-wider text-[#636573] hover:text-[#111218] transition-colors flex items-center gap-1"
          >
            <span>Back to Home</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          MAIN AUTH STAGE: 2-COLUMN HERO + NEO FORM
      ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: VALUE PROPOSITION & LIVE METRICS */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B8FF3D] border-2 border-[#111218] rounded-full shadow-neo-sm">
              <span className="w-2 h-2 rounded-full bg-[#111218] animate-ping" />
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#111218]">
                Real-Time Learning OS
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-black font-display uppercase tracking-tight text-[#111218] leading-[1.08]">
                Master Any Video.{' '}
                <span className="bg-[#B8FF3D] px-2 py-0.5 border-2 border-[#111218] shadow-neo-sm inline-block">
                  Broken into Chapters.
                </span>
              </h1>
              <p className="text-base font-medium text-[#636573] max-w-lg leading-relaxed">
                Sign in with Firebase or use 1-click test credentials. Paste any YouTube lecture link to instantly generate checkpoint chapters, auto-quizzes, and interactive knowledge graphs.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-1">
                <div className="w-7 h-7 rounded-lg bg-[#E9DFFF] border border-[#111218] flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <h4 className="text-xs font-bold font-display text-[#111218]">Instant AI Segmentation</h4>
                <p className="text-[11px] text-[#636573]">Splits long videos into targeted topic chapters with Groq LPU speed</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-1">
                <div className="w-7 h-7 rounded-lg bg-[#B8FF3D] border border-[#111218] flex items-center justify-center font-bold text-xs">
                  🔥
                </div>
                <h4 className="text-xs font-bold font-display text-[#111218]">Firebase Auth</h4>
                <p className="text-[11px] text-[#636573]">Secure authentication with Google Sign-in and real email accounts</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-1">
                <div className="w-7 h-7 rounded-lg bg-[#DCEEFF] border border-[#111218] flex items-center justify-center font-bold text-xs">
                  🎯
                </div>
                <h4 className="text-xs font-bold font-display text-[#111218]">Grounded Checkpoints</h4>
                <p className="text-[11px] text-[#636573]">Strictly verifiable questions gated by video timestamps</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm space-y-1">
                <div className="w-7 h-7 rounded-lg bg-[#FFFDF7] border border-[#111218] flex items-center justify-center font-bold text-xs">
                  🔒
                </div>
                <h4 className="text-xs font-bold font-display text-[#111218]">Local First Engine</h4>
                <p className="text-[11px] text-[#636573]">Runs locally with zero cloud deployment friction</p>
              </div>
            </div>

            {/* Quote */}
            <div className="p-4 rounded-2xl bg-[#FFFDF7] border-2 border-[#111218] shadow-neo-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#B8FF3D] border-2 border-[#111218] flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-neo-sm">
                KB
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111218] italic">
                  &ldquo;Paste any YouTube link — Saras AI breaks it down into chapters, tests your mastery, and tracks your retention.&rdquo;
                </p>
                <p className="text-[10px] font-bold text-[#636573] uppercase tracking-wider font-display mt-0.5">
                  — Saras AI Learning Engine
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE AUTH CARD */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="bg-[#FFFDF7] border-2 border-[#111218] rounded-3xl p-6 sm:p-8 shadow-neo-lg space-y-5 relative">
              
              {/* TAB SWITCHER */}
              <div className="flex p-1 bg-[#F5F3EC] border-2 border-[#111218] rounded-xl shadow-neo-sm">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold font-display uppercase tracking-wider rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-[#111218] text-white shadow-neo-sm'
                      : 'text-[#111218] hover:text-[#636573]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold font-display uppercase tracking-wider rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-[#111218] text-white shadow-neo-sm'
                      : 'text-[#111218] hover:text-[#636573]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* GOOGLE SIGN IN BUTTON */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FFFDF7] hover:bg-white text-[#111218] border-2 border-[#111218] shadow-neo-sm hover:shadow-neo text-xs font-black font-display uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#111218]/20" />
                </div>
                <span className="relative px-3 bg-[#FFFDF7] text-[10px] font-bold uppercase tracking-widest text-[#636573] font-mono">
                  Or with email
                </span>
              </div>

              {/* SUCCESS / ERROR ALERTS */}
              {error && (
                <div className="p-3 rounded-xl bg-[#FFD1C7] border-2 border-[#111218] shadow-neo-sm text-xs font-semibold text-[#111218] flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#111218]" />
                  <span>{error}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-[#B8FF3D] border-2 border-[#111218] shadow-neo-sm text-xs font-bold text-[#111218] flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#111218]" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────
                  MODE A: SIGN IN FORM (Firebase)
              ───────────────────────────────────────────────────────── */}
              {mode === 'signin' && (
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111218] font-display">
                      Email Address
                    </label>
                    <div className="relative flex items-center rounded-xl bg-[#F5F3EC] border-2 border-[#111218] focus-within:bg-[#FFFDF7] focus-within:shadow-neo-sm transition-all">
                      <Mail className="w-4 h-4 ml-3 text-[#111218]" />
                      <input
                        type="email"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent px-3 py-2.5 text-xs font-semibold text-[#111218] focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111218] font-display">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInEmail('kunal@saras.ai');
                          setSignInPassword('password123');
                          setError(null);
                        }}
                        className="text-[10px] font-mono font-bold text-[#636573] hover:text-[#111218] underline"
                      >
                        Autofill Demo Creds
                      </button>
                    </div>
                    <div className="relative flex items-center rounded-xl bg-[#F5F3EC] border-2 border-[#111218] focus-within:bg-[#FFFDF7] focus-within:shadow-neo-sm transition-all">
                      <Lock className="w-4 h-4 ml-3 text-[#111218]" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        required
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent px-3 py-2.5 text-xs font-semibold text-[#111218] focus:outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="p-2 text-[#636573] hover:text-[#111218] transition-colors"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-2 border-[#111218] text-[#111218] focus:ring-0 cursor-pointer accent-[#B8FF3D]"
                      />
                      <span className="text-xs font-medium text-[#111218]">Keep me logged in</span>
                    </label>

                    <span className="text-[11px] font-semibold text-[#636573]">
                      Firebase Auth
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#111218] text-white hover:bg-[#21232C] border-2 border-[#111218] shadow-neo-sm hover:shadow-neo text-xs font-black font-display uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Authenticating with Firebase...' : 'Sign In with Firebase'}</span>
                    <ArrowRight className="w-4 h-4 text-[#B8FF3D]" />
                  </button>
                </form>
              )}

              {/* ─────────────────────────────────────────────────────────
                  MODE B: CREATE ACCOUNT FORM (Firebase)
              ───────────────────────────────────────────────────────── */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111218] font-display">
                      Full Name
                    </label>
                    <div className="relative flex items-center rounded-xl bg-[#F5F3EC] border-2 border-[#111218] focus-within:bg-[#FFFDF7] focus-within:shadow-neo-sm transition-all">
                      <User className="w-4 h-4 ml-3 text-[#111218]" />
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Alex Chen"
                        className="w-full bg-transparent px-3 py-2 text-xs font-semibold text-[#111218] focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111218] font-display">
                      Email Address
                    </label>
                    <div className="relative flex items-center rounded-xl bg-[#F5F3EC] border-2 border-[#111218] focus-within:bg-[#FFFDF7] focus-within:shadow-neo-sm transition-all">
                      <Mail className="w-4 h-4 ml-3 text-[#111218]" />
                      <input
                        type="email"
                        required
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full bg-transparent px-3 py-2 text-xs font-semibold text-[#111218] focus:outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-[#111218] font-display">
                      Password (min 6 chars)
                    </label>
                    <div className="relative flex items-center rounded-xl bg-[#F5F3EC] border-2 border-[#111218] focus-within:bg-[#FFFDF7] focus-within:shadow-neo-sm transition-all">
                      <Lock className="w-4 h-4 ml-3 text-[#111218]" />
                      <input
                        type={showSignUpPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        value={signUpPassword}
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-transparent px-3 py-2 text-xs font-semibold text-[#111218] focus:outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="p-2 text-[#636573] hover:text-[#111218] transition-colors"
                      >
                        {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Learning Track Selector Chips */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#111218] font-display">
                      Primary Learning Focus
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {LEARNING_TRACKS.map((track) => (
                        <button
                          key={track.id}
                          type="button"
                          onClick={() => setSelectedTrack(track.label)}
                          className={`p-1.5 rounded-xl text-left border-2 text-[11px] font-bold font-display transition-all flex items-center gap-1.5 ${
                            selectedTrack === track.label
                              ? 'bg-[#B8FF3D] text-[#111218] border-[#111218] shadow-neo-sm'
                              : 'bg-[#F5F3EC] text-[#636573] border-[#111218]/30 hover:border-[#111218]'
                          }`}
                        >
                          <span>{track.icon}</span>
                          <span className="truncate">{track.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-[#B8FF3D] hover:bg-[#C6FF57] text-[#111218] border-2 border-[#111218] shadow-neo-sm hover:shadow-neo text-xs font-black font-display uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition-all cursor-pointer mt-2"
                  >
                    <span>{isSubmitting ? 'Registering with Firebase...' : 'Create Firebase Account'}</span>
                    <ArrowRight className="w-4 h-4 text-[#111218]" />
                  </button>
                </form>
              )}

              {/* ⚡ 1-CLICK QUICK DEMO PROFILES STRIP */}
              <div className="space-y-2 pt-2 border-t border-[#111218]/15">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111218] flex items-center gap-1 font-display">
                    <Zap className="w-3 h-3 text-[#111218] fill-[#B8FF3D]" />
                    <span>Or Instant Demo Switcher</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#636573] bg-[#F5F3EC] px-1.5 py-0.5 rounded border border-[#111218]/20">
                    Offline Sandbox
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {demoUsers.slice(0, 4).map((demo) => (
                    <button
                      key={demo.id}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleQuickDemoClick(demo.id, demo.name)}
                      className="p-1.5 rounded-xl bg-[#F5F3EC] hover:bg-[#FFFDF7] border border-[#111218] shadow-neo-sm hover:shadow-neo text-left flex items-center gap-2 group disabled:opacity-50 transition-all"
                      title={`Instant login as ${demo.name}`}
                    >
                      <div
                        className="w-6 h-6 rounded-lg border border-[#111218] flex items-center justify-center text-[10px] font-black font-display flex-shrink-0"
                        style={{ backgroundColor: demo.avatarBg }}
                      >
                        {demo.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-[#111218] font-display truncate">
                          {demo.name.split(' ')[0]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* FOOTER SWITCHER */}
              <div className="text-center pt-1 border-t border-[#111218]/10">
                {mode === 'signin' ? (
                  <p className="text-xs text-[#636573]">
                    Don&apos;t have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-bold text-[#111218] underline hover:text-[#B8FF3D] transition-colors"
                    >
                      Create one with Firebase
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-[#636573]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="font-bold text-[#111218] underline hover:text-[#B8FF3D] transition-colors"
                    >
                      Sign In here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          FOOTER COPYRIGHT & GUEST QUICK JUMP
      ───────────────────────────────────────────────────────────── */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-t-2 border-[#111218]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#636573]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#111218] font-display">Saras AI</span>
          <span>•</span>
          <span>Local Engine & Firebase Auth</span>
        </div>

        <div className="flex items-center gap-4">
          <NextLink
            href="/discover"
            className="font-bold text-[#111218] hover:underline flex items-center gap-1"
          >
            <span>Skip to Workspace →</span>
          </NextLink>
        </div>
      </footer>
    </div>
  );
}
