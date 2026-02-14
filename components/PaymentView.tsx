
import React from 'react';

interface PaymentViewProps {
  onPaymentSuccess: () => void;
}

const PaymentView: React.FC<PaymentViewProps> = ({ onPaymentSuccess }) => {
  return (
    <div className="h-full flex items-center justify-center bg-slate-950 p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[150px] rounded-full"></div>
      
      <div className="glass w-full max-w-2xl p-12 rounded-[4rem] border border-slate-800 relative z-10 flex flex-col md:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Priority Launch Price</div>
            <h2 className="text-4xl font-black">Unlock Pro <br /><span className="text-orange-500">Creativity</span></h2>
            <p className="text-slate-400 font-medium leading-relaxed">Get unlimited access to cinematic videos, high-res images, and premium Indian voiceovers.</p>
          </div>
          
          <ul className="space-y-3">
            {[
              'Cinematic 9:16 Vertical Video',
              'Photorealistic Indian Scenes',
              'Local Accents (Hindi/English)',
              'Priority GPU Generation',
              'Commercial Usage Rights'
            ].map(item => (
              <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                <i className="fa-solid fa-circle-check text-emerald-500"></i>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-72 bg-slate-900 rounded-[3rem] p-8 border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Creator Startup Plan</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl font-black text-white">₹99</span>
              <span className="text-sm text-slate-500 font-bold">/week</span>
            </div>
          </div>
          
          <div className="w-full h-px bg-slate-800"></div>
          
          <div className="w-full space-y-4">
             <button 
              onClick={onPaymentSuccess}
              className="w-full py-5 rounded-2xl bg-orange-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-orange-900/20 hover:bg-orange-600 active:scale-95 transition-all"
             >
               Subscribe Now
             </button>
             <p className="text-[9px] text-slate-600 font-bold uppercase leading-tight">Secure payment via Razorpay. <br />Cancel anytime in settings.</p>
          </div>
          
          <div className="flex gap-4 grayscale opacity-30">
            <i className="fa-brands fa-cc-visa text-xl"></i>
            <i className="fa-brands fa-cc-mastercard text-xl"></i>
            <i className="fa-solid fa-building-columns text-xl"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
