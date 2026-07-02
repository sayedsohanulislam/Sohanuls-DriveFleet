"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { MdDirectionsCar } from 'react-icons/md';

const Login = () => {
  const { login, googleLogin, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login — DriveFleet';
    if (user) router.push(from);
  }, [user, router, from]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! 👋');
      router.replace(from);
      router.refresh();
    } catch (err) {
      const msg = err?.status === 401 || err?.message?.toLowerCase().includes('invalid')
        ? 'Invalid email or password'
        : err?.status === 429
        ? 'Too many attempts. Try again later.'
        : err?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await googleLogin();
      router.push(from);
    } catch {
      toast.error('Google login failed. Try again.');
      setGLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{
        background: 'radial-gradient(ellipse at 30% 50%, rgba(255,85,0,0.06) 0%, var(--navy) 60%)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <MdDirectionsCar style={{ color: 'var(--orange)', fontSize: '2rem' }} />
          <span className="font-display text-3xl tracking-widest">
            DRIVE<span style={{ color: 'var(--orange)' }}>FLEET</span>
          </span>
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
        >
          <h1 className="font-display text-4xl mb-1">WELCOME BACK</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Sign in to continue your journey
          </p>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg mb-6 font-ui font-semibold tracking-wide text-sm transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--navy-border)', color: 'var(--text-primary)' }}
          >
            {gLoading
              ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              : <FcGoogle size={20} />
            }
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--navy-border)' }} />
            <span className="font-ui text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--navy-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="df-input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="df-input pl-10 pr-11"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base"
              disabled={loading}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</span>
                : 'Login'
              }
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
            Do not have an account?{' '}
            <Link href="/register" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--orange)' }}>
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
