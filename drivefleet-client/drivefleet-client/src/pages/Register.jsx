import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiImage, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { MdDirectionsCar } from 'react-icons/md';

const Register = () => {
  const { register, googleLogin, logout, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', photoURL: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  useEffect(() => {
    document.title = 'Register — DriveFleet';
    if (user) navigate('/');
  }, [user, navigate]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  // Password validation checks
  const checks = {
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    length: form.password.length >= 8,
  };
  const passwordValid = checks.uppercase && checks.lowercase && checks.length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordValid) {
      toast.error('Please fix the password errors below');
      return;
    }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.photoURL);
      await logout();
      toast.success('Account created! Please sign in. 🎉');
      navigate('/login');
    } catch (err) {
      const msg = err?.message?.includes('already') || err?.status === 422
        ? 'This email is already registered'
        : err?.message || 'Registration failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGLoading(true);
    try {
      await googleLogin();
    } catch {
      toast.error('Google login failed.');
      setGLoading(false);
    }
  };

  const CheckRow = ({ ok, label }) => (
    <div className="flex items-center gap-2 text-xs">
      {ok
        ? <FiCheckCircle size={13} style={{ color: '#4ade80' }} />
        : <FiXCircle size={13} style={{ color: '#f87171' }} />
      }
      <span style={{ color: ok ? '#4ade80' : '#f87171' }}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20"
      style={{
        background: 'radial-gradient(ellipse at 70% 50%, rgba(255,85,0,0.06) 0%, var(--navy) 60%)',
      }}
    >
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <MdDirectionsCar style={{ color: 'var(--orange)', fontSize: '2rem' }} />
          <span className="font-display text-3xl tracking-widest">
            DRIVE<span style={{ color: 'var(--orange)' }}>FLEET</span>
          </span>
        </Link>

        <div
          className="rounded-2xl p-8"
          style={{ background: 'var(--navy-card)', border: '1px solid var(--navy-border)' }}
        >
          <h1 className="font-display text-4xl mb-1">CREATE ACCOUNT</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join DriveFleet and start your journey
          </p>

          <button
            onClick={handleGoogle}
            disabled={gLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg mb-6 font-ui font-semibold tracking-wide text-sm transition-all hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--navy-border)' }}
          >
            {gLoading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <FcGoogle size={20} />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'var(--navy-border)' }} />
            <span className="font-ui text-xs tracking-widest uppercase" style={{ color: 'var(--text-secondary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--navy-border)' }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                <input type="text" name="name" required placeholder="John Doe" value={form.name} onChange={handleChange} className="df-input pl-10" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                <input type="email" name="email" required placeholder="you@example.com" value={form.email} onChange={handleChange} className="df-input pl-10" autoComplete="email" />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>Photo URL (optional)</label>
              <div className="relative">
                <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                <input type="url" name="photoURL" placeholder="https://..." value={form.photoURL} onChange={handleChange} className="df-input pl-10" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-ui text-xs tracking-widest uppercase block mb-2" style={{ color: 'var(--text-secondary)' }}>Password</label>
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
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                  {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {/* Password checker */}
              {form.password && (
                <div
                  className="mt-2 p-3 rounded-lg space-y-1.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--navy-border)' }}
                >
                  <CheckRow ok={checks.length} label="At least 8 characters" />
                  <CheckRow ok={checks.uppercase} label="Contains uppercase letter (A-Z)" />
                  <CheckRow ok={checks.lowercase} label="Contains lowercase letter (a-z)" />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-base"
              disabled={loading || !passwordValid}
              style={{ opacity: (!loading && !passwordValid) ? 0.5 : 1 }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account...</span>
                : 'Create Account'
              }
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold transition-colors hover:underline" style={{ color: 'var(--orange)' }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
