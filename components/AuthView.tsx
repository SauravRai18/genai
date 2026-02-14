
import React, { useState } from 'react';

interface AuthViewProps {
  onAuthSuccess: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="h-full flex items-center justify-center bg-slate-950 p-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full"></div>
      
      <div className="glass w-full max-w-md p-10 rounded-[3rem] border border-slate-800 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-6 shadow-xl shadow-orange-900/40">B</div>
          <h2 className="text-3xl font-black">{isLogin ? 'Welcome Back' : 'Join BharatAI'}</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">
            {isLogin ? 'Access your high-performance studio' : 'The fastest way to generate Indian cinematic content'}
          </p>
        </div>

        <div className="space-y-4">
          <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-lg">
            <i className="fa-brands fa-google"></i> Continue with Google
          </button>
          
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-slate-800"></div>
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">or secure credentials</span>
            <div className="flex-1 h-px bg-slate-800"></div>
          </div>

          <div className="space-y-3">
            {!showPhone ? (
              <>
                <div className="relative">
                  <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-xs"></i>
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                  />
                </div>
              </>
            ) : (
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-black">+91</span>
                <input 
                  type="tel" 
                  placeholder="10-digit Phone Number" 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
                />
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowPhone(!showPhone)}
            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors w-full text-center"
          >
            {showPhone ? 'Use Email Instead' : 'Login via Phone OTP'}
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <button 
            onClick={onAuthSuccess}
            className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-900/20 hover:bg-orange-600 active:scale-95 transition-all"
          >
            {isLogin ? 'Launch Dashboard' : 'Create Account'}
          </button>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
            >
              {isLogin ? "New Creator? Sign Up" : "Already a member? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
