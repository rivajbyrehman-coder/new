import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
}

export const MarketTicker: React.FC = () => {
  const [items, setItems] = useState<TickerItem[]>([
    { symbol: 'XAU/USD (Gold)', price: '$2,748.20', change: '+1.42%', isUp: true },
    { symbol: 'USD/PKR', price: '₨ 278.40', change: '+0.15%', isUp: true },
    { symbol: 'EUR/USD', price: '$1.0872', change: '-0.24%', isUp: false },
    { symbol: 'BTC/USDT', price: '$89,450', change: '+3.85%', isUp: true },
    { symbol: 'GBP/USD', price: '$1.3015', change: '+0.12%', isUp: true },
  ]);

  // Small live fluctuation effect every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (Math.random() > 0.4) return item;
          const delta = (Math.random() * 0.1 - 0.04).toFixed(2);
          const isUp = parseFloat(delta) >= 0;
          return {
            ...item,
            change: `${isUp ? '+' : ''}${delta}%`,
            isUp,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#090c12] border-b border-slate-800/80 overflow-x-auto py-1.5 px-3 scrollbar-none flex items-center gap-4 text-xs select-none">
      <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        Market
      </div>
      <div className="flex items-center gap-4 shrink-0">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 shrink-0 font-mono">
            <span className="text-slate-400 font-medium">{item.symbol}</span>
            <span className="text-slate-200 font-semibold">{item.price}</span>
            <span
              className={`flex items-center text-[11px] font-bold ${
                item.isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {item.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
