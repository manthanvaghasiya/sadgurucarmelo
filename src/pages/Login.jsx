import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
  User,
  Briefcase,
  Lock,
  Mail,
  UserCircle,
  KeyRound,
} from 'lucide-react';

const ROLES = [
  { id: 'customer', label: 'Customer', icon: User },
  { id: 'sales', label: 'Sales Team', icon: Briefcase },
  { id: 'admin', label: 'Admin', icon: Lock },
];

const ROLE_CONFIG = {
  customer: {
    fields: [
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', icon: Mail },
      { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock },
    ],
    redirect: '/',
    cta: 'Sign In',
  },
  sales: {
    fields: [
      { name: 'employeeId', label: 'Employee ID', type: 'text', placeholder: 'e.g. SCM-EMP-042', icon: UserCircle },
      { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Lock },
    ],
    redirect: '/sales',
    cta: 'Sign In',
  },
  admin: {
    fields: [
      { name: 'username', label: 'Admin Username', type: 'text', placeholder: 'Enter admin username', icon: KeyRound },
      { name: 'password', label: 'Master Password', type: 'password', placeholder: '••••••••', icon: Lock },
    ],
    redirect: '/admin',
    cta: 'Sign In',
  },
};

export default function Login() {
  const [activeRole, setActiveRole] = useState('customer');
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const config = ROLE_CONFIG[activeRole];

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId);
    setFormData({});
    setShowPassword(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate(config.redirect);
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ═══════════════════════════════════════════════
          Left: Hero Image Panel (Desktop Only)
         ═══════════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1562141961-b5d1a9b441af?auto=format&fit=crop&w=1920&q=80"
          alt="Premium car showroom"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />

        {/* Content Over Image */}
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          {/* Top Branding */}
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

          {/* Center Tagline */}
          <div className="max-w-md">
            <h2 className="font-heading font-bold text-4xl xl:text-5xl text-white leading-tight mb-4">
              Your trusted partner in premium pre-owned vehicles.
            </h2>
            <p className="font-body text-base text-white/60 leading-relaxed">
              Certified quality, transparent pricing, and a seamless buying experience — right here in Gujarat.
            </p>

            {/* Trust Counters */}
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

          {/* Bottom Attribution */}
          <p className="font-body text-xs text-white/20">
            © {new Date().getFullYear()} Sadguru Car Melo. All rights reserved.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          Right: Login Form Panel
         ═══════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile Branding (hidden on desktop, shown on mobile) */}
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

            {/* Card Header */}
            <div className="px-7 pt-8 pb-6">
              <h1 className="font-heading font-bold text-2xl text-text">
                Welcome Back
              </h1>
              <p className="font-body text-sm text-text-muted mt-1">
                Please sign in to your account.
              </p>
            </div>

            {/* ── Role Selection Tabs ── */}
            <div className="px-7 pb-6">
              <div className="bg-background rounded-xl p-1 flex">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isActive = activeRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleChange(role.id)}
                      className={`
                        flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg
                        font-body text-[13px] font-semibold
                        transition-all duration-200
                        ${isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'text-text-muted hover:text-text'
                        }
                      `}
                    >
                      <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2.5 : 2} />
                      <span className="hidden sm:inline">{role.label}</span>
                      <span className="sm:hidden">
                        {role.id === 'customer' ? 'User' : role.id === 'sales' ? 'Sales' : 'Admin'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Admin Warning Badge ── */}
            {activeRole === 'admin' && (
              <div className="mx-7 mb-5 flex items-center gap-2.5 px-4 py-3 bg-[#f59e0b]/8 border border-[#f59e0b]/15 rounded-xl">
                <ShieldAlert className="w-4 h-4 text-[#d97706] shrink-0" />
                <span className="font-body text-xs font-semibold text-[#d97706]">
                  Restricted Access — Authorized personnel only
                </span>
              </div>
            )}

            {/* ── Dynamic Form ── */}
            <form onSubmit={handleSubmit} className="px-7 pb-8">
              <div className="space-y-4">
                {config.fields.map((field) => {
                  const Icon = field.icon;
                  const isPasswordField = field.type === 'password';
                  return (
                    <div key={field.name} className="space-y-2">
                      <label className="font-body text-sm font-semibold text-text">
                        {field.label}
                      </label>
                      <div className="relative">
                        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type={isPasswordField && showPassword ? 'text' : field.type}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className={`
                            w-full pl-10 py-3.5 bg-background rounded-lg
                            font-body text-sm text-text placeholder:text-text-muted/50
                            outline-none transition-all
                            focus:ring-2 focus:ring-primary/10 focus:bg-background
                            ${isPasswordField ? 'pr-12' : 'pr-4'}
                          `}
                          required
                          autoComplete={isPasswordField ? 'current-password' : 'off'}
                        />
                        {isPasswordField && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors rounded-lg"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer-only: Forgot Password */}
              {activeRole === 'customer' && (
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 accent-primary cursor-pointer"
                    />
                    <span className="font-body text-sm text-text-muted">Remember me</span>
                  </label>
                  <a
                    href="#"
                    className="font-body text-sm text-primary font-semibold hover:underline"
                  >
                    Forgot Password?
                  </a>
                </div>
              )}

              {/* Sales-only: Contact admin hint */}
              {activeRole === 'sales' && (
                <p className="font-body text-xs text-text-muted/60 mt-4">
                  Forgot credentials? Contact the admin office to reset.
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 mt-6 py-4 bg-primary hover:bg-primary-hover text-white rounded-lg font-body font-bold text-[15px] transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {config.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              {/* Customer-only: Create Account */}
              {activeRole === 'customer' && (
                <p className="text-center font-body text-sm text-text-muted mt-6">
                  Don't have an account?{' '}
                  <a href="#" className="text-primary font-semibold hover:underline">
                    Create Account
                  </a>
                </p>
              )}
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
