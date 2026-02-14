
import React, { useState, useEffect } from 'react';

interface AuthViewProps {
  onAuthSuccess: (method: 'email' | 'google' | 'otp') => void;
}

type AuthMethod = 'email' | 'phone';

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<AuthMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleAction = async () => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));
    
    if (method === 'phone' && !isVerifyingOtp) {
      setIsVerifyingOtp(true);
      setTimer(30);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      onAuthSuccess(method === 'email' ? 'email' : 'otp');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-slate-950 p-6 md:p-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full animate-pulse delay-700"></div>
      
      <div className="glass w-full max-w-lg p-8 md:p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative z-10 transition-all duration-500">
        <div className="text-center space-y-3 mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto shadow-2xl shadow-orange-900/40 transform hover:rotate-6 transition-transform cursor-pointer">B</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {isVerifyingOtp ? 'Verify OTP' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 font-medium text-sm px-4">
            {isVerifyingOtp 
              ? 'We sent a 6-digit code to your mobile number.' 
              : isLogin ? 'Access your high-performance Indian studio' : 'Start generating cinematic Bharat stories in seconds'}
          </p>
        </div>

        {!isVerifyingOtp ? (
          <div className="space-y-8 animate-fadeIn">
            {/* Social Auth */}
            <div className="space-y-3">
              <button 
                onClick={() => onAuthSuccess('google')}
                className="w-full py-4 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl active:scale-95"
              >
                <i className="fa-brands fa-google text-lg"></i> Continue with Google
              </button>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-800"></div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Secure Credentials</span>
              <div className="flex-1 h-px bg-slate-800"></div>
            </div>

            {/* Auth Method Tabs */}
            <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-800">
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-slate-800 text-orange-500 shadow-lg' : 'text-slate-500'}`}
              >
                Email
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-slate-800 text-orange-500 shadow-lg' : 'text-slate-500'}`}
              >
                Phone OTP
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {method === 'email' ? (
                <div className="space-y-4">
                  <div className="relative group">
                    <i className="fa-solid fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-sm group-focus-within:text-orange-500 transition-colors"></i>
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-6 py-4.5 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/40 outline-none transition-all"
                    />
                  </div>
                  <div className="relative group">
                    <i className="fa-solid fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 text-sm group-focus-within:text-orange-500 transition-colors"></i>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Password" 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-14 py-4.5 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/40 outline-none transition-all"
                    />
                    <button 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  {isLogin && (
                    <div className="flex justify-end px-2">
                       <button className="text-[10px] font-black text-slate-600 uppercase hover:text-orange-500 transition-colors">Forgot Password?</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-black tracking-widest">+91</span>
                  <input 
                    type="tel" 
                    placeholder="10-digit Phone Number" 
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-16 pr-6 py-4.5 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/40 outline-none transition-all tracking-[0.2em]"
                    maxLength={10}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={handleAction}
                disabled={isLoading}
                className="w-full py-5 rounded-[1.5rem] bg-orange-500 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-900/30 hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-shield-halved"></i>}
                {isLoading ? 'Processing...' : method === 'phone' ? 'Send Verification OTP' : isLogin ? 'Launch Dashboard' : 'Create Account'}
              </button>

              <div className="text-center">
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-orange-500 transition-colors"
                >
                  {isLogin ? "New Creator? Join the Movement" : "Already a member? Secure Login"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* OTP Verification State */
          <div className="space-y-10 animate-slideUp">
             <div className="grid grid-cols-6 gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-full aspect-square bg-slate-900 border border-slate-800 rounded-xl text-center text-xl font-black text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                  />
                ))}
             </div>

             <div className="space-y-6">
                <button 
                  onClick={handleAction}
                  disabled={isLoading || otp.some(d => !d)}
                  className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-orange-600 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-circle-check"></i>}
                  {isLoading ? 'Verifying...' : 'Confirm OTP & Enter'}
                </button>

                <div className="text-center">
                   {timer > 0 ? (
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Resend OTP in {timer}s</p>
                   ) : (
                     <button 
                      onClick={() => setTimer(30)}
                      className="text-[10px] font-black text-orange-500 uppercase tracking-widest hover:underline"
                     >
                       Didn't receive code? Resend
                     </button>
                   )}
                </div>
                
                <button 
                  onClick={() => setIsVerifyingOtp(false)}
                  className="w-full text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-slate-500 transition-colors"
                >
                   Edit Phone Number
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthView;
