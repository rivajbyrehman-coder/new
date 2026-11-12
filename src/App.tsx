import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { HomeTab } from './components/HomeTab';
import { DepositTab } from './components/DepositTab';
import { WithdrawTab } from './components/WithdrawTab';
import { AccountTab } from './components/AccountTab';
import { BottomNav } from './components/BottomNav';
import { PlanModal } from './components/PlanModal';
import { CalculatorModal } from './components/CalculatorModal';
import { SupportModal } from './components/SupportModal';
import { AdminPortal } from './components/AdminPortal';
import { AuthScreen } from './components/AuthScreen';
import { ToastContainer } from './components/Toast';
import { Plan } from './types';
import { OFFICIAL_PLANS, SUPPORT_DETAILS } from './data/plans';
import { MessageCircle, HelpCircle } from 'lucide-react';

type TabType = 'home' | 'deposit' | 'withdraw' | 'account';

const MainApp: React.FC = () => {
  const { isAuthenticated, user } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
  };

  const handleSelectPlanFromCalc = (planId: number) => {
    const p = OFFICIAL_PLANS.find((x) => x.id === planId);
    if (p) setSelectedPlan(p);
  };

  // If user is not logged in / registered, show the compulsory AuthScreen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b0e14]">
        <ToastContainer />
        <AuthScreen />
      </div>
    );
  }

  // ADMIN ACCOUNT: Strictly show Admin Portal interface only!
  // Customer interface (trading, buy plans, deposit, withdraw, tickers, bottom nav) is completely hidden.
  if (user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-[#080c14]">
        <ToastContainer />
        <AdminPortal />
      </div>
    );
  }

  // CUSTOMER ACCOUNT: Customer interface only (no admin elements or controls)
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-20">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Top Header */}
      <Header
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => {}}
      />

      {/* Live Market Rates Ticker */}
      <MarketTicker />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-4">
        {activeTab === 'home' && (
          <HomeTab
            onSelectPlan={handleSelectPlan}
            onSwitchTab={setActiveTab}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
          />
        )}

        {activeTab === 'deposit' && (
          <DepositTab />
        )}

        {activeTab === 'withdraw' && (
          <WithdrawTab />
        )}

        {activeTab === 'account' && (
          <AccountTab
            onOpenSupport={() => setIsSupportOpen(true)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenAdmin={() => {}}
          />
        )}
      </main>

      {/* Floating WhatsApp Quick Contact Button with Help Sign */}
      <a
        href={SUPPORT_DETAILS.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white py-2 px-3.5 rounded-full shadow-2xl shadow-emerald-950/70 hover:scale-105 active:scale-95 transition-all border border-emerald-300/40 group cursor-pointer"
        title="Chat on WhatsApp (Help Support)"
      >
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <HelpCircle className="w-3.5 h-3.5 text-white" />
        </div>
        <MessageCircle className="w-4 h-4 fill-white text-white" />
        <span className="text-xs font-extrabold tracking-tight">
          Chat on WhatsApp
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-200 animate-ping"></span>
      </a>

      {/* Sticky Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <PlanModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onGoToDeposit={() => setActiveTab('deposit')}
      />

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSelectPlan={handleSelectPlanFromCalc}
      />

      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
