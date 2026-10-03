import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { AuthService } from '../../services/authService';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('testuser');
  const [password, setPassword] = useState('Password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = AuthService.login(username, password);
      setIsLoading(false);
      if (res.success) {
        onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Authentication failed');
      }
    }, 300);
  };

  const handleFillDemoCreds = () => {
    setUsername('testuser');
    setPassword('Password123');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Subtle Glowing Background Accents */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Layout: Left Title Info (Floating on Canvas) & Right Login Card */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center z-10">
        
        {/* Left Side: Minimalist Brand Title & Subtitle (No Outer Card Enclosure!) */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-display tracking-tight text-white">RAGSQL</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight">
              Ask your database in <span className="text-gradient-cyan">Plain English</span>.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Retrieval-Augmented Natural Language Interface for Database Querying. Instant schema retrieval, automated ANSI SQL generation, and interactive data analytics.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono pt-2">
            <span>BIRD Benchmark Evaluated</span>
            <span>•</span>
            <span className="text-cyan-400">RAG Architecture</span>
          </div>
        </div>

        {/* Right Side: Distinct, Clean Login Form Card */}
        <div className="md:col-span-6 flex justify-center md:justify-end">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">Access your RAGSQL AI database assistant</p>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Creds Helper */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Demo Account:</span>
                <span className="font-mono text-cyan-400 font-semibold">testuser / Password123</span>
              </div>
              <button
                type="button"
                onClick={handleFillDemoCreds}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span>Fill Demo Credentials</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
