import React from 'react';
import { 
  Vehicle, 
  MaintenanceRecord, 
  FuelRecord, 
  TireSet, 
  BatteryRecord, 
  ReminderNotification,
  MaintenanceScheduleItem 
} from '../types';
import { 
  formatCurrency, 
  formatKm, 
  formatDate, 
  calculateFuelStats, 
  calculateMaintenanceStats, 
  calculateOverallExpenses 
} from '../utils/calculations';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Plus, 
  Fuel, 
  Wrench, 
  Disc, 
  BatteryCharging, 
  Calendar, 
  ArrowUpRight, 
  Gauge, 
  Clock, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { TabType } from './NavigationTabs';

interface DashboardViewProps {
  vehicle: Vehicle;
  maintenance: MaintenanceRecord[];
  fuel: FuelRecord[];
  tires: TireSet[];
  batteries: BatteryRecord[];
  schedules: MaintenanceScheduleItem[];
  reminders: ReminderNotification[];
  onChangeTab: (tab: TabType) => void;
  onOpenAddFuel: () => void;
  onOpenAddMaintenance: () => void;
  onOpenAddTire: () => void;
  onOpenAddSchedule: () => void;
  onQuickUpdateKm: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  vehicle,
  maintenance,
  fuel,
  tires,
  batteries,
  schedules,
  reminders,
  onChangeTab,
  onOpenAddFuel,
  onOpenAddMaintenance,
  onOpenAddTire,
  onOpenAddSchedule,
  onQuickUpdateKm,
}) => {
  const fuelStats = calculateFuelStats(fuel);
  const maintStats = calculateMaintenanceStats(maintenance);
  const overallExpenses = calculateOverallExpenses(vehicle, maintenance, fuel, tires, batteries);

  const mountedTire = tires.find(t => t.isCurrentlyInstalled);
  const activeBattery = batteries.find(b => b.isActive);

  // Sıradaki en yakın bakım planı
  const upcomingSchedule = schedules
    .filter(s => s.targetKm && s.targetKm >= vehicle.currentKm)
    .sort((a, b) => (a.targetKm! - b.targetKm!))[0];

  const remainingScheduleKm = upcomingSchedule?.targetKm 
    ? upcomingSchedule.targetKm - vehicle.currentKm 
    : null;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* 1. Üst Bilgi Kartı & Hızlı Eylemler */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Dekoratif arka plan çemberleri */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg font-mono text-sm sm:text-base font-bold tracking-widest border border-white/20">
                {vehicle.plate}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase font-semibold">
                {vehicle.fuelType} • {vehicle.transmission}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mt-2 tracking-tight">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {vehicle.subModel || `${vehicle.year} Model`} {vehicle.enginePower ? `• ${vehicle.enginePower}` : ''}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <button 
                onClick={onQuickUpdateKm}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-sm transition-colors border border-white/15"
                title="KM Güncelle"
              >
                <Gauge className="w-4 h-4 text-blue-400" />
                <span>Güncel: <strong className="font-mono text-white text-sm">{formatKm(vehicle.currentKm)}</strong></span>
              </button>

              {vehicle.inspectionDate && (
                <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Muayene: <strong className="text-white">{formatDate(vehicle.inspectionDate)}</strong></span>
                </div>
              )}

              {vehicle.engineOilSpec && (
                <div className="hidden sm:flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Yağ: <strong className="text-white">{vehicle.engineOilSpec}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Hızlı Ekleme Butonları */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-2.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={onOpenAddFuel}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Fuel className="w-4 h-4" />
              <span>+ Yakıt Ekle</span>
            </button>

            <button
              onClick={onOpenAddMaintenance}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Wrench className="w-4 h-4" />
              <span>+ Bakım Ekle</span>
            </button>

            <button
              onClick={onOpenAddTire}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Disc className="w-4 h-4 text-amber-400" />
              <span>+ Lastik İşlemi</span>
            </button>

            <button
              onClick={onOpenAddSchedule}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-all hover:scale-[1.02]"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>+ Hatırlatıcı</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Acil Uyarılar ve Hatırlatıcılar (Reminders Banner) */}
      {reminders.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Kritik Hatırlatıcılar ve Bakım Uyarıları</span>
            </h2>
            <button
              onClick={() => onChangeTab('schedule')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
            >
              Tüm Planı Gör ({reminders.length}) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reminders.slice(0, 4).map((rem) => {
              const isDanger = rem.type === 'danger';
              const isWarning = rem.type === 'warning';
              return (
                <div
                  key={rem.id}
                  onClick={() => onChangeTab('schedule')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 shadow-sm hover:shadow-md ${
                    isDanger
                      ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200'
                      : isWarning
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                      : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl flex-shrink-0 ${
                      isDanger
                        ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                        : isWarning
                        ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
                        : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {isDanger ? (
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    ) : isWarning ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-xs sm:text-sm truncate">
                        {rem.title}
                      </h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/60 dark:bg-black/30">
                        {rem.category}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                      {rem.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. İstatistik ve Metrik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Ortalama Tüketim */}
        <div 
          onClick={() => onChangeTab('fuel')}
          className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Yakıt Tüketimi</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {fuelStats.avgConsumptionL100 > 0 ? `${fuelStats.avgConsumptionL100} L` : '-'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/100km</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>KM Başı: <strong>{fuelStats.avgCostPerKm > 0 ? `${fuelStats.avgCostPerKm} ₺` : '-'}</strong></span>
            <span className="text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">Detay →</span>
          </p>
        </div>

        {/* Toplam Bakım Masrafı */}
        <div 
          onClick={() => onChangeTab('maintenance')}
          className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bakım & Servis</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {formatCurrency(maintStats.totalCost)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>{maintStats.recordCount} servis kaydı</span>
            <span className="text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">Detay →</span>
          </p>
        </div>

        {/* Sıradaki Bakım */}
        <div 
          onClick={() => onChangeTab('schedule')}
          className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sıradaki Bakım</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {remainingScheduleKm !== null ? formatKm(remainingScheduleKm) : '-'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
            {upcomingSchedule?.title || 'Tüm bakımlar güncel'}
          </p>
        </div>

        {/* Toplam Harcama (Tüm Masraflar) */}
        <div 
          onClick={() => onChangeTab('reports')}
          className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-amber-400 dark:hover:border-amber-500 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Toplam Masraf</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {formatCurrency(overallExpenses.totalExpense)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Km Başına: <strong>{overallExpenses.costPerKm} ₺</strong></span>
            <span className="text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform">Raporlar →</span>
          </p>
        </div>
      </div>

      {/* 4. Lastik & Akü Hızlı Durum Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Takılı Lastik Özeti */}
        <div 
          onClick={() => onChangeTab('tires-battery')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                <Disc className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Takılı Lastik Seti
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mountedTire ? `${mountedTire.brand} ${mountedTire.model}` : 'Henüz aktif lastik seçilmedi'}
                </p>
              </div>
            </div>
            {mountedTire && (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                mountedTire.season === 'yazlik' 
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : mountedTire.season === 'kislik'
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                  : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
              }`}>
                {mountedTire.season === 'yazlik' ? '☀️ Yazlık' : mountedTire.season === 'kislik' ? '❄️ Kışlık' : '🌿 4 Mevsim'}
              </span>
            )}
          </div>

          {mountedTire ? (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Ebat</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">{mountedTire.size}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Diş Derinliği</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {mountedTire.treadDepthMm ? `${mountedTire.treadDepthMm} mm` : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Kullanım</span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  {formatKm(mountedTire.totalKmUsed || 0)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
              Lastik takibi yapmak ve mevsimsel değişimleri kaydetmek için tıklayın.
            </p>
          )}
        </div>

        {/* Aktif Akü Özeti */}
        <div 
          onClick={() => onChangeTab('tires-battery')}
          className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-amber-300 dark:hover:border-amber-600 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Mevcut Akü
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeBattery ? `${activeBattery.brand} ${activeBattery.model}` : 'Henüz akü kaydedilmedi'}
                </p>
              </div>
            </div>
            {activeBattery && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                {activeBattery.technology.toUpperCase()}
              </span>
            )}
          </div>

          {activeBattery ? (
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Kapasite / Marş</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {activeBattery.capacityAh} Ah • {activeBattery.ccaA} A
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Değişim Tarihi</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatDate(activeBattery.changeDate)}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Garanti Bitiş</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatDate(activeBattery.warrantyEndDate)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
              Akü sağlığını ve garanti süresini takip etmek için tıklayın.
            </p>
          )}
        </div>
      </div>

      {/* 5. Son İşlemler & Bakım Geçmişi Özeti */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Son Bakım ve Servis İşlemleri</span>
          </h3>
          <button
            onClick={() => onChangeTab('maintenance')}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Tüm Bakımları Gör ({maintenance.length}) →
          </button>
        </div>

        {maintenance.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <Wrench className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            Bu araç için henüz kayıtlı bakım bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {maintenance.slice(0, 3).map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.serviceName} • <span className="font-mono">{formatKm(item.km)}</span>
                      {item.parts && item.parts.length > 0 && (
                        <span className="ml-1.5 text-blue-600 dark:text-blue-400 font-medium">
                          ({item.parts.length} parça kullanıldı)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(item.totalCost)}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(item.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
