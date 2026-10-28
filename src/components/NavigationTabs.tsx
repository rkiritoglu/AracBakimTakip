import React from 'react';
import { 
  LayoutDashboard, 
  Wrench, 
  Fuel, 
  Disc, 
  CalendarClock, 
  BarChart3, 
  Settings 
} from 'lucide-react';

export type TabType = 'dashboard' | 'maintenance' | 'fuel' | 'tires-battery' | 'schedule' | 'reports' | 'vehicle';

interface NavigationTabsProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  urgentCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onChangeTab,
  urgentCount = 0,
}) => {
  const tabs = [
    { id: 'dashboard' as TabType, label: 'Genel Bakış', icon: LayoutDashboard },
    { id: 'maintenance' as TabType, label: 'Bakım & Parça', icon: Wrench },
    { id: 'fuel' as TabType, label: 'Yakıt Takibi', icon: Fuel },
    { id: 'tires-battery' as TabType, label: 'Lastik & Akü', icon: Disc },
    { 
      id: 'schedule' as TabType, 
      label: 'Bakım Takvimi', 
      icon: CalendarClock,
      badge: urgentCount > 0 ? urgentCount : undefined 
    },
    { id: 'reports' as TabType, label: 'Masraf & Raporlar', icon: BarChart3 },
    { id: 'vehicle' as TabType, label: 'Araç Profili', icon: Settings },
  ];

  return (
    <>
      {/* Desktop / Tablet Navigasyon Çubuğu */}
      <div className="hidden md:block bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onChangeTab(tab.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobil Alt Menü Barı (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 flex justify-around items-center">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              type="button"
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5 tracking-tight truncate max-w-[60px]">{tab.label}</span>
            </button>
          );
        })}
        {/* Daha fazla butonu / Raporlar ve Araç Profili */}
        <button
          onClick={() => onChangeTab(activeTab === 'reports' ? 'vehicle' : 'reports')}
          type="button"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'reports' || activeTab === 'vehicle'
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="mt-0.5 tracking-tight">Raporlar</span>
        </button>
      </div>
    </>
  );
};
