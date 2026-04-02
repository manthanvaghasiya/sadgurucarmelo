import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Assume login is exported from AuthContext

  const onSubmit = async (data) => {
    try {
      const { default: axiosInstance } = await import('../api/axiosConfig');
      // Backend auth endpoint expects 'employeeId'
      const response = await axiosInstance.post('/auth/login', {
        employeeId: data.username, 
        password: data.password
      });
      
      const userData = response.data.data;
      // Properly hydrate the Context API
      login(userData, userData.token);
      toast.success('Welcome to the Dashboard!');
      
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/sales');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid Credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Branding & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-xl shadow-primary/20 mb-5">
            <span className="font-heading font-black text-2xl text-white">S</span>
          </div>
          <h1 className="font-heading font-bold text-2xl text-text mb-1 tracking-tight">
            Sadguru Car Melo
          </h1>
          <p className="font-body text-sm font-semibold text-accent uppercase tracking-wider">
            Secure Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface rounded-2xl shadow-xl shadow-primary/5 border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">
                Username
              </label>
              <div className="relative">
                <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.username ? 'text-red-500' : 'text-text-muted'}`} />
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Enter your username"
                  className={`w-full pl-10 pr-4 py-3 bg-background border ${errors.username ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-100'} focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10`}
                />
              </div>
              {errors.username && (
                <span className="text-red-500 text-xs font-body font-medium">{errors.username.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-text">
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.password ? 'text-red-500' : 'text-text-muted'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 bg-background border ${errors.password ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-100'} focus:border-primary/30 rounded-xl font-body text-sm text-text placeholder:text-text-muted/50 outline-none transition-all focus:ring-2 focus:ring-primary/10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors rounded-lg"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs font-body font-medium">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white py-3.5 mt-2 rounded-xl font-body font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <p className="text-center font-body text-xs text-text-muted/60 mt-6 font-medium">
          Secured access for authorized personnel only.
        </p>
      </div>
    </div>
  );
}
