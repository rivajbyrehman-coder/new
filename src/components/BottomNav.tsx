import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ArrowDownLeft, ArrowUpRight, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'deposit' | 'withdraw' | 'account';
  onTabChange: (tab: 'home' | 'deposit' | 'withdraw' | 'account') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useApp();

  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'deposit', label: t.deposit, icon: ArrowDownLeft },
    { id: 'withdraw', label: t.withdraw, icon: ArrowUpRight },
    { id: 'account', label: t.account, icon: User },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c1017]/95 backdrop-blur-md border-t border-slate-800 shadow-2xl safe-area-pb">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-amber-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400"></span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
