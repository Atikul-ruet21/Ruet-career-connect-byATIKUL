import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, User } from '../types';
import { Eye, EyeOff, Loader2, GraduationCap, Lock, Mail, User as UserIcon, ArrowLeft } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

type AuthMode = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

const Auth: React.FC<AuthProps> = ({ onLoginSuccess, onBack }) => {
  const { login, register } = useApp(); // Use Context methods instead of external service
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.STUDENT as UserRole,
    department: '',
    graduationYear: new Date().getFullYear(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the login function from AppContext (which checks mockDatabase)
      const success = await login(formData.email, formData.password);
      if (success) {
        onLoginSuccess();
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Prepare the new user object
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        graduationYear: Number(formData.graduationYear),
        isVerified: formData.role === UserRole.STUDENT ? true : false, // Alumni need admin verification
        skills: [],
        education: []
      };

      // Use the register function from AppContext
      await register(newUser);
      
      setSuccessMsg("Registration successful! Please login. Alumni require admin verification before posting jobs.");
      setMode('LOGIN');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation only
    setSuccessMsg(`If an account exists for ${formData.email}, a reset link has been sent.`);
    setTimeout(() => setMode('LOGIN'), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full animate-fade-in relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 text-slate-400 hover:text-brand-900 transition"
          title="Back to Home"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-center mb-8 pt-4">
          <GraduationCap className="h-12 w-12 text-brand-900 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-brand-900">RUET Career Connect</h1>
          <p className="text-slate-500">
            {mode === 'LOGIN' ? 'Sign in to your account' : mode === 'REGISTER' ? 'Create a new account' : 'Reset Password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded border border-green-200">
            {successMsg}
          </div>
        )}

        {mode === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setMode('FORGOT_PASSWORD')}
                className="text-sm text-brand-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-white p-3 rounded font-medium hover:bg-brand-800 transition flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            </button>
          </form>
        )}

        {mode === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="name"
                type="text"
                required
                placeholder="Full Name"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select
                name="role"
                className="p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none bg-white"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value={UserRole.STUDENT}>Student</option>
                <option value={UserRole.ALUMNI}>Alumni/Recruiter</option>
              </select>
              
              <input
                 name="department"
                 type="text"
                 placeholder="Department (e.g. CSE)"
                 required
                 className="p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                 value={formData.department}
                 onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 text-white p-3 rounded font-medium hover:bg-brand-800 transition flex justify-center items-center"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            </button>
          </form>
        )}

        {mode === 'FORGOT_PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                name="email"
                type="email"
                required
                placeholder="Email Address"
                className="w-full pl-10 p-3 border border-slate-300 rounded focus:ring-2 focus:ring-brand-500 outline-none"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-brand-900 text-white p-3 rounded font-medium hover:bg-brand-800 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm">
          {mode === 'LOGIN' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setMode('REGISTER')} className="text-brand-600 font-bold hover:underline">
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('LOGIN')} className="text-brand-600 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>
        
        {/* Mock Credentials Hint */}
        {mode === 'LOGIN' && (
          <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400">
            <p>Demo Credentials:</p>
            <p>Student: alice@ruet.ac.bd / password123</p>
            <p>Alumni: bob@tech.com / password123</p>
            <p>Admin: dsw@ruet.ac.bd / password123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;