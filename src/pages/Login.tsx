import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import type { BusinessSettings } from '../types';
import { loginAdmin, registerInitialAdmin, checkIfAdminExists, getCurrentAdmin } from '../services/authService';

interface LoginProps {
  settings: BusinessSettings;
  onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ settings, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // If already logged in, go straight to admin
    const current = getCurrentAdmin();
    if (current) {
      navigate('/admin');
      return;
    }

    checkIfAdminExists().then((exists) => {
      setHasAdmins(exists);
      if (!exists) {
        setIsRegisterMode(true);
        setEmail(settings.email || 'joshuayankey19@gmail.com');
      }
    });
  }, [navigate, settings.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (isRegisterMode) {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        await registerInitialAdmin(email.trim(), password);
      } else {
        await loginAdmin(email.trim(), password);
      }

      if (onLoginSuccess) onLoginSuccess();
      navigate('/admin');
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-soft-lg border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-navy to-brand-blue flex items-center justify-center text-white mx-auto shadow-md">
            <Lock className="w-7 h-7 text-brand-cyan" />
          </div>
          <h1 className="text-2xl font-black text-brand-navy tracking-tight">
            {isRegisterMode ? 'Initial Admin Setup' : 'Admin Portal Login'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isRegisterMode
              ? 'Create the primary administrator account for YANKEY Cleaning.'
              : 'Sign in with authorized staff or administrator credentials.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@yankey.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-brand-blue focus:outline-hidden"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isRegisterMode ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Administrator Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In To Portal</span>
              </>
            )}
          </button>
        </form>

        {hasAdmins && (
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs text-brand-blue hover:underline font-semibold"
            >
              {isRegisterMode ? 'Already have an account? Sign In' : 'Need to register a new admin user?'}
            </button>
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>YANKEY Protected Operational Dashboard</span>
        </div>
      </div>
    </div>
  );
};
