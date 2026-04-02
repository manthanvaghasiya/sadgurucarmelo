import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, UserCircle, ArrowRight, Briefcase } from 'lucide-react';

export default function SalesLogin() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/sales');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[400px] relative">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-5">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-text mb-1">
            Sales Portal
          </h1>
          <p className="font-body text-sm text-text-muted">
            Sadguru Car Melo — Staff Access
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface rounded-2xl shadow-xl shadow-primary/5 border border-gray-100 p-7">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Employee ID */}
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">
                Employee ID / Username
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter your Employee ID"
                  className="w-full pl-10 pr-4 py-3 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                  required
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
                  className="w-full pl-10 pr-12 py-3 bg-background border border-transparent focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10"
                  required
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-body font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Login to Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-body text-xs text-text-muted/50 mt-6">
          Contact admin if you've forgotten your credentials.
        </p>
      </div>
    </div>
  );
}
