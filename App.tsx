
import React, { useState, useEffect } from 'react';
import { View, GenerationResult, Template, Notification, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CreatorStudio from './components/CreatorStudio';
import History from './components/History';
import TemplateGallery from './components/TemplateGallery';
import LiveAssistant from './components/LiveAssistant';
import Profile from './components/Profile';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import AuthView from './components/AuthView';
import PaymentView from './components/PaymentView';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [history, setHistory] = useState<GenerationResult[]>([]);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [selectedTemplatePrompt, setSelectedTemplatePrompt] = useState<string>('');
  
  const [user, setUser] = useState<User>({
    id: 'user-001',
    name: 'Bharat Creator',
    email: 'creator@bharat.ai',
    credits: 2,
    plan: 'FREE',
    isLoggedIn: false
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      }
    };
    checkKey();
  }, []);

  const handleSelectApiKey = async () => {
    if ((window as any).aistudio?.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotification: Notification = {
      ...n,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
  };

  const handleAuthSuccess = () => {
    setUser(prev => ({ ...prev, isLoggedIn: true }));
    setCurrentView(View.PAYMENT);
    addNotification({
      title: 'Welcome!',
      message: 'Account verified successfully.',
      type: 'success'
    });
  };

  const handlePaymentSuccess = () => {
    setUser(prev => ({ ...prev, plan: 'WEEKLY', credits: 15 }));
    setCurrentView(View.DASHBOARD);
    addNotification({
      title: 'Upgrade Successful',
      message: 'Weekly Pro Plan (₹99) is now active.',
      type: 'success'
    });
  };

  const addToHistory = (item: GenerationResult) => {
    setHistory(prev => [item, ...prev]);
    setUser(prev => ({ ...prev, credits: Math.max(0, prev.credits - 1) }));
    addNotification({
      title: 'Production Ready',
      message: `Project "${item.prompt.substring(0, 15)}..." has been finalized.`,
      type: 'success'
    });
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplatePrompt(template.prompt);
    setCurrentView(View.STUDIO);
  };

  const renderView = () => {
    if (!user.isLoggedIn && currentView !== View.LANDING) {
      return <AuthView onAuthSuccess={handleAuthSuccess} />;
    }

    switch (currentView) {
      case View.LANDING:
        return <LandingPage onGetStarted={() => setCurrentView(View.AUTH)} />;
      case View.AUTH:
        return <AuthView onAuthSuccess={handleAuthSuccess} />;
      case View.PAYMENT:
        return <PaymentView onPaymentSuccess={handlePaymentSuccess} />;
      case View.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} recentGenerations={history} />;
      case View.STUDIO:
        return (
          <CreatorStudio 
            onSuccess={addToHistory} 
            hasApiKey={hasApiKey} 
            onSelectKey={handleSelectApiKey} 
            initialPrompt={selectedTemplatePrompt}
            onPromptUsed={() => setSelectedTemplatePrompt('')}
          />
        );
      case View.LIVE:
        return <LiveAssistant />;
      case View.HISTORY:
        return <History items={history} toggleFavorite={toggleFavorite} onItemsChange={setHistory} />;
      case View.TEMPLATES:
        return <TemplateGallery onSelect={handleTemplateSelect} />;
      case View.PROFILE:
        return <Profile user={user} />;
      case View.ANALYTICS:
        return <Analytics />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} recentGenerations={history} />;
    }
  };

  const showChrome = user.isLoggedIn && user.plan !== 'FREE' && ![View.LANDING, View.AUTH, View.PAYMENT].includes(currentView);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30 overflow-hidden">
      {showChrome && <Sidebar currentView={currentView} setView={setCurrentView} />}
      
      <main className="flex-1 h-screen overflow-y-auto relative no-scrollbar">
        {showChrome && (
          <header className="sticky top-0 z-[60] glass border-b border-slate-800 px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-black text-white text-xl">B</div>
               <h1 className="text-xl font-extrabold hidden sm:block">BharatAI <span className="text-orange-500">Studio</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex flex-col items-end mr-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Plan</span>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-bold">{user.plan} CREATOR (₹99/wk)</span>
                 </div>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-11 h-11 rounded-full bg-slate-900 border flex items-center justify-center transition-all ${notifications.some(n => !n.read) ? 'border-orange-500 text-orange-500' : 'border-slate-800 text-slate-400'}`}
                >
                  <i className="fa-solid fa-bell"></i>
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-orange-500 border-2 border-slate-950 rounded-full"></span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 glass border border-slate-800 rounded-[2rem] p-4 shadow-2xl z-[70] animate-slideUp">
                    <div className="flex justify-between items-center px-2 mb-4">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Job Monitor</p>
                       <button onClick={() => setNotifications(n => n.map(x => ({...x, read: true})))} className="text-[9px] font-black text-orange-500 uppercase">Mark Read</button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto no-scrollbar">
                       {notifications.length === 0 ? (
                         <p className="text-center py-10 text-xs text-slate-600 italic">No active job signals.</p>
                       ) : (
                         notifications.map(n => (
                           <div key={n.id} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all">
                              <p className={`text-[10px] font-black uppercase mb-1 ${n.type === 'success' ? 'text-emerald-500' : 'text-orange-500'}`}>{n.title}</p>
                              <p className="text-xs text-slate-300 mb-1">{n.message}</p>
                              <span className="text-[9px] font-black text-slate-600 uppercase">{n.time}</span>
                           </div>
                         ))
                       )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 pl-4 pr-1.5 py-1.5 rounded-2xl">
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Credits</span>
                    <span className="text-xs font-black text-orange-500">{user.credits} Remaining</span>
                 </div>
                 <button onClick={() => setCurrentView(View.PROFILE)} className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                    <i className="fa-solid fa-user text-xs"></i>
                 </button>
              </div>
            </div>
          </header>
        )}
        
        <div className={showChrome ? "p-8 max-w-7xl mx-auto" : "h-full"}>
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
