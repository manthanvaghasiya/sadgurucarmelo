import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin');
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ═══════════════════════════════════════════════
          Left: Hero Image Panel (Desktop Only)
         ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1562141961-b5d1a9b441af?auto=format&fit=crop&w=1920&q=80"
          alt="Premium car showroom"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center font-heading font-black text-lg text-white shadow-lg shadow-accent/30">
              S
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-white leading-tight">
                Sadguru Car Melo
              </span>
              <p className="font-body text-[10px] text-white/40 font-semibold uppercase tracking-widest">
                Premium Used Cars
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="font-heading font-bold text-4xl xl:text-5xl text-white leading-tight mb-4">
              Your trusted partner in premium pre-owned vehicles.
            </h2>
            <p className="font-body text-base text-white/60 leading-relaxed">
              Certified quality, transparent pricing, and a seamless buying experience — right here in Gujarat.
            </p>

            <div className="flex items-center gap-8 mt-10">
              <div>
                <p className="font-heading font-bold text-3xl text-accent">2500+</p>
                <p className="font-body text-xs text-white/40 font-semibold mt-1">Cars Sold</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="font-heading font-bold text-3xl text-white">98%</p>
                <p className="font-body text-xs text-white/40 font-semibold mt-1">Happy Clients</p>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <p className="font-heading font-bold text-3xl text-white">15+</p>
                <p className="font-body text-xs text-white/40 font-semibold mt-1">Years Trust</p>
              </div>
            </div>
          </div>

          <p className="font-body text-xs text-white/20">
            © {new Date().getFullYear()} Sadguru Car Melo. All rights reserved.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          Right: Login Form Panel
         ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile Branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-4">
              <span className="font-heading font-black text-xl text-white">S</span>
            </div>
            <h1 className="font-heading font-bold text-xl text-text">
              Sadguru Car Melo
            </h1>
          </div>

          {/* Login Card */}
          <div className="bg-surface rounded-2xl shadow-xl shadow-primary/5 border border-gray-100 overflow-hidden">
            <div className="px-7 pt-8 pb-2">
              <h1 className="font-heading font-bold text-2xl text-text">
                Welcome Back
              </h1>
              <p className="font-body text-sm text-text-muted mt-1">
                Sign in to your account to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-7 pt-6 pb-8 space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="font-body text-sm font-semibold text-text">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3.5 bg-background rounded-lg font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="font-body text-sm font-semibold text-text">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3.5 bg-background rounded-lg font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors rounded-lg"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                  />
                  <span className="font-body text-sm text-text-muted">Remember me</span>
                </label>
                <a href="#" className="font-body text-sm text-primary font-semibold hover:underline">
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-body font-bold text-[15px] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              to="/"
              className="font-body text-xs text-text-muted/50 hover:text-text-muted transition-colors"
            >
              ← Back to Website
            </Link>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <a
              href="#"
              className="font-body text-xs text-text-muted/50 hover:text-text-muted transition-colors"
            >
              Need Help?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
