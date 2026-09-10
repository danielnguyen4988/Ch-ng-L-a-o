import React from 'react';
import { Layers, FileSearch, MessageSquareWarning, Smartphone, BookOpen } from 'lucide-react';

export type TabKey = 'bill' | 'sms' | 'link' | 'phone' | 'guide';

interface NavigationTabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: TabKey; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'bill',
      label: 'Biên Lai Chuyển Tiền',
      icon: <FileSearch className="w-4 h-4 text-emerald-400" />,
      badge: 'Soi Thật / Giả',
    },
    {
      id: 'sms',
      label: 'Tin Nhắn & Kịch Bản Lừa',
      icon: <MessageSquareWarning className="w-4 h-4 text-amber-400" />,
      badge: 'Cảnh Báo Dập Máy',
    },
    {
      id: 'link',
      label: 'Link Web & Tệp Cài Đặt',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      badge: 'Chặn Web Lừa & App Độc',
    },
    {
      id: 'phone',
      label: 'SĐT, Ngân Hàng & Shipper',
      icon: <Smartphone className="w-4 h-4 text-purple-400" />,
      badge: 'Chặn Bom Hàng & STK Rác',
    },
    {
      id: 'guide',
      label: 'Hướng Dẫn Dễ Dùng',
      icon: <BookOpen className="w-4 h-4 text-rose-400" />,
      badge: 'Cẩm Nang & Mẹo',
    },
  ];

  return (
    <div className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-[57px] z-30">
      <div className="max-w-6xl mx-auto px-4 flex gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-slate-900 text-teal-300 border-teal-500/50 shadow-md shadow-teal-500/10'
                  : 'bg-slate-950/40 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono hidden lg:inline ${
                    isActive ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
