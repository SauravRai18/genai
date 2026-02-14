
import React, { useState, useEffect } from 'react';
import { View, GenerationResult, Template, Notification } from './types';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
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

  const addToHistory = (item: GenerationResult) => {
    setHistory(prev => [item, ...prev]);
    addNotification({
      id: Math.random().toString(36).substr(2, 9),
      title: 'Production Complete',
      message: `Your production "${item.prompt.substring(0, 20)}..." is ready.`,
      time: 'Just now',
      read: false
    });
  };

  const addNotification = (n: Notification) => {
    setNotifications(prev => [n, ...prev].slice(0, 5));
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplatePrompt(template.prompt);
    setCurrentView(View.STUDIO);
  };

  const toggleFavorite = (id: string) => {
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const renderView = () => {
    if (currentView === View.LANDING) {
      return <LandingPage onGetStarted={() => setCurrentView(View.AUTH)} />;
    }

    if (currentView === View.AUTH) {
      return <AuthView onAuthSuccess={() => { setIsLoggedIn(true); setCurrentView(View.PAYMENT); }} />;
    }

    if (currentView === View.PAYMENT) {
      return <PaymentView onPaymentSuccess={() => { setIsSubscribed(true); setCurrentView(View.DASHBOARD); }} />;
    }

    switch (currentView) {
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
        return <Profile isSubscribed={isSubscribed} />;
      case View.ANALYTICS:
        return <Analytics />;
      case View.SETTINGS:
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} recentGenerations={history} />;
    }
  };

  const showSidebar = isLoggedIn && isSubscribed && ![View.LANDING, View.AUTH, View.PAYMENT].includes(currentView);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-orange-500/30">
      {showSidebar && <Sidebar currentView={currentView} setView={setCurrentView} />}
      <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth">
        {showSidebar && (
          <header className="sticky top-0 z-40 glass px-8 py-4 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-900/20">
                B
              </div>
              <h1 className="text-xl font-extrabold tracking-tight">BharatAI <span className="text-orange-500">Studio</span></h1>
            </div>
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pipeline Health</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-sm font-semibold">99.8% System Uptime</span>
                </div>
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`w-10 h-10 rounded-full bg-slate-800 border flex items-center justify-center transition-all ${unreadCount > 0 ? 'border-orange-500 text-orange-500 shadow-lg shadow-orange-500/10' : 'border-slate-700 text-slate-400'}`}
                >
                  <i className="fa-solid fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-950">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-4 w-80 glass border border-slate-800 rounded-3xl shadow-2xl p-4 z-50 animate-slideUp">
                    <div className="flex justify-between items-center mb-4 px-2">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Feed</h4>
                       <button onClick={() => setNotifications([])} className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Clear</button>
                    </div>
                    <div className="space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-center py-8 text-xs text-slate-600 italic">No new signals</p>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all cursor-pointer">
                            <p className="text-[10px] font-black text-orange-500 uppercase mb-1">{n.title}</p>
                            <p className="text-xs text-slate-300 mb-1 leading-snug">{n.message}</p>
                            <span className="text-[9px] font-black text-slate-600 uppercase">{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setCurrentView(View.PROFILE)}
                className={`w-10 h-10 rounded-full bg-slate-800 border flex items-center justify-center transition-colors ${currentView === View.PROFILE ? 'border-orange-500 text-orange-500' : 'border-slate-700 text-slate-400 hover:border-orange-500'}`}
              >
                <i className="fa-solid fa-user"></i>
              </button>
            </div>
          </header>
        )}

        <div className={showSidebar ? "p-8 max-w-7xl mx-auto" : "h-full"}>
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
