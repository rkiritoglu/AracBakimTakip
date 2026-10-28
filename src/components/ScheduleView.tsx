import React, { useState } from 'react';
import { Vehicle, MaintenanceScheduleItem } from '../types';
import { 
  formatKm, 
  formatDate, 
  calculateDaysBetween 
} from '../utils/calculations';
import { 
  CalendarClock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCcw, 
  Calendar, 
  Gauge, 
  ShieldCheck, 
  Edit3, 
  X, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScheduleViewProps {
  vehicle: Vehicle;
  schedules: MaintenanceScheduleItem[];
  onSaveSchedule: (item: MaintenanceScheduleItem) => void;
  onDeleteSchedule: (id: string) => void;
  onResetTemplates: () => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  vehicle,
  schedules,
  onSaveSchedule,
  onDeleteSchedule,
  onResetTemplates,
  isOpenAddModal,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'warning' | 'good'>('all');
  const [editingItem, setEditingItem] = useState<MaintenanceScheduleItem | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    category: 'periyodik' | 'sivi' | 'parca' | 'yasal' | 'lastik' | 'agir' | 'diger';
    intervalKm: string;
    intervalMonths: string;
    lastDoneKm: string;
    lastDoneDate: string;
    notes: string;
  }>({
    title: '',
    category: 'periyodik',
    intervalKm: '10000',
    intervalMonths: '12',
    lastDoneKm: vehicle.currentKm.toString(),
    lastDoneDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const openNewModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'periyodik',
      intervalKm: '10000',
      intervalMonths: '12',
      lastDoneKm: vehicle.currentKm.toString(),
      lastDoneDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    onOpenAddModal();
  };

  const openEditModal = (item: MaintenanceScheduleItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      intervalKm: item.intervalKm ? item.intervalKm.toString() : '',
      intervalMonths: item.intervalMonths ? item.intervalMonths.toString() : '',
      lastDoneKm: item.lastDoneKm ? item.lastDoneKm.toString() : '',
      lastDoneDate: item.lastDoneDate || '',
      notes: item.notes || '',
    });
    onOpenAddModal();
  };

  // "Bakımı Yapıldı Olarak İşle" hızlı butonu
  const handleMarkAsDone = (item: MaintenanceScheduleItem) => {
    const today = new Date().toISOString().split('T')[0];
    const curKm = vehicle.currentKm;

    let nextTargetKm: number | undefined;
    if (item.intervalKm) {
      nextTargetKm = curKm + item.intervalKm;
    }

    let nextTargetDate: string | undefined;
    if (item.intervalMonths) {
      const d = new Date();
      d.setMonth(d.getMonth() + item.intervalMonths);
      nextTargetDate = d.toISOString().split('T')[0];
    }

    const updated: MaintenanceScheduleItem = {
      ...item,
      lastDoneKm: curKm,
      lastDoneDate: today,
      targetKm: nextTargetKm,
      targetDate: nextTargetDate,
    };

    onSaveSchedule(updated);

    // Başarı konfeti animasyonu
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const intervalKmNum = formData.intervalKm ? Number(formData.intervalKm) : undefined;
    const intervalMonthsNum = formData.intervalMonths ? Number(formData.intervalMonths) : undefined;
    const lastDoneKmNum = formData.lastDoneKm ? Number(formData.lastDoneKm) : undefined;

    let targetKm: number | undefined;
    if (intervalKmNum && lastDoneKmNum !== undefined) {
      targetKm = lastDoneKmNum + intervalKmNum;
    }

    let targetDate: string | undefined;
    if (intervalMonthsNum && formData.lastDoneDate) {
      const d = new Date(formData.lastDoneDate);
      d.setMonth(d.getMonth() + intervalMonthsNum);
      targetDate = d.toISOString().split('T')[0];
    }

    const newItem: MaintenanceScheduleItem = {
      id: editingItem ? editingItem.id : `sch-${Date.now()}`,
      vehicleId: vehicle.id,
      title: formData.title.trim(),
      category: formData.category,
      intervalKm: intervalKmNum,
      intervalMonths: intervalMonthsNum,
      lastDoneKm: lastDoneKmNum,
      lastDoneDate: formData.lastDoneDate || undefined,
      targetKm,
      targetDate,
      notes: formData.notes.trim() || undefined,
      isDefaultTemplate: editingItem ? editingItem.isDefaultTemplate : false,
    };

    onSaveSchedule(newItem);
    onCloseAddModal();
  };

  // Her kalemin durumunu hesapla
  const today = new Date();
  const scheduleItemsWithStatus = schedules.map(item => {
    let status: 'urgent' | 'warning' | 'good' = 'good';
    let remKm: number | null = null;
    let remDays: number | null = null;
    let kmPercent = 100;

    if (item.targetKm !== undefined && item.targetKm !== null) {
      remKm = item.targetKm - vehicle.currentKm;
      if (item.intervalKm && item.lastDoneKm !== undefined) {
        const elapsed = vehicle.currentKm - item.lastDoneKm;
        kmPercent = Math.max(0, Math.min(100, 100 - (elapsed / item.intervalKm) * 100));
      }
      if (remKm <= 0) {
        status = 'urgent';
      } else if (remKm <= 1000) {
        status = 'warning';
      }
    }

    if (item.targetDate) {
      remDays = calculateDaysBetween(today, item.targetDate);
      if (remDays <= 0) {
        status = 'urgent';
      } else if (remDays <= 30 && status !== 'urgent') {
        status = 'warning';
      }
    }

    return {
      item,
      status,
      remKm,
      remDays,
      kmPercent,
    };
  });

  const filteredItems = scheduleItemsWithStatus.filter(({ status }) => {
    if (filter === 'all') return true;
    return status === filter;
  });

  const urgentCount = scheduleItemsWithStatus.filter(s => s.status === 'urgent').length;
  const warningCount = scheduleItemsWithStatus.filter(s => s.status === 'warning').length;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-emerald-500" />
            <span>Periyodik Bakım Aralıkları & Planlayıcı</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Kilometre ve zamana bağlı bakım periyotları, yaklaşan değişimler ve yasal tarihler
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('Varsayılan standart bakım periyot şablonlarını geri yüklemek istiyor musunuz?')) {
                onResetTemplates();
              }
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 transition-colors"
            title="Standart Şablonları Yükle"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Şablonları Yenile</span>
          </button>

          <button
            onClick={openNewModal}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>+ Yeni Hatırlatıcı / Plan Ekle</span>
          </button>
        </div>
      </div>

      {/* Durum Filtreleri */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
          }`}
        >
          Tüm Planlar ({schedules.length})
        </button>

        <button
          onClick={() => setFilter('urgent')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'urgent'
              ? 'bg-rose-600 text-white'
              : 'bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Gecikenler / Acil ({urgentCount})</span>
        </button>

        <button
          onClick={() => setFilter('warning')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'warning'
              ? 'bg-amber-500 text-white'
              : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Yaklaşanlar ({warningCount})</span>
        </button>

        <button
          onClick={() => setFilter('good')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            filter === 'good'
              ? 'bg-emerald-600 text-white'
              : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>İyi Durumda</span>
        </button>
      </div>

      {/* Bakım Planları Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(({ item, status, remKm, remDays, kmPercent }) => {
          const isUrgent = status === 'urgent';
          const isWarning = status === 'warning';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between ${
                isUrgent
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60'
                  : isWarning
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Kart Üstü: Başlık & Durum Rozeti */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {item.category === 'sivi' ? 'Sıvı & Yağ' : item.category === 'parca' ? 'Filtre & Parça' : item.category === 'yasal' ? 'Yasal Zorunluluk' : 'Periyodik'}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isUrgent
                      ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 animate-pulse'
                      : isWarning
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {isUrgent ? 'ACİL / ZAMANI GELDİ' : isWarning ? 'YAKLAŞTI' : 'İYİ DURUMDA'}
                  </span>
                </div>

                {/* Periyot Açıklaması */}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-1 font-medium">
                  {item.intervalKm && (
                    <span>Her <strong>{formatKm(item.intervalKm)}</strong></span>
                  )}
                  {item.intervalKm && item.intervalMonths && <span>veya</span>}
                  {item.intervalMonths && (
                    <span>Her <strong>{item.intervalMonths} Ay</strong></span>
                  )}
                </div>

                {/* Kalan KM ve Gün Çubukları */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2.5">
                  {item.targetKm !== undefined && (
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Kilometre Durumu</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {remKm !== null && remKm <= 0 ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              {Math.abs(remKm)} km aşıldı!
                            </span>
                          ) : (
                            <span>{remKm !== null ? formatKm(remKm) : '-'} kaldı</span>
                          )}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUrgent ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(5, Math.min(100, kmPercent))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5 font-mono">
                        <span>Son: {formatKm(item.lastDoneKm)}</span>
                        <span>Hedef: {formatKm(item.targetKm)}</span>
                      </div>
                    </div>
                  )}

                  {item.targetDate && (
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-900/40 p-2 rounded-xl">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hedef Tarih: <strong>{formatDate(item.targetDate)}</strong></span>
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {remDays !== null && remDays <= 0 ? (
                          <span className="text-rose-600 dark:text-rose-400">{Math.abs(remDays)} gün geçti</span>
                        ) : (
                          <span>{remDays} gün kaldı</span>
                        )}
                      </span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                      {item.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Kart Altı: Hızlı Bakımı Tamamla Butonu & Düzenleme */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleMarkAsDone(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Bakımı Yapıldı Olarak İşle</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Bu bakım planını silmek istediğinize emin misiniz?')) {
                        onDeleteSchedule(item.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* YENİ / DÜZENLE BAKIM PLANI MODALI */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-emerald-500" />
                <span>{editingItem ? 'Bakım Planını Düzenle' : 'Yeni Bakım Planı / Hatırlatıcı'}</span>
              </h3>
              <button onClick={onCloseAddModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Bakım / Parça Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: Şanzıman Yağı Değişimi veya Diferansiyel Yağı"
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as any }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="periyodik">Periyodik Bakım</option>
                    <option value="sivi">Sıvı & Yağ</option>
                    <option value="parca">Filtre & Yedek Parça</option>
                    <option value="yasal">Yasal Zorunluluk (Muayene vb.)</option>
                    <option value="diger">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Bakım Aralığı (KM)
                  </label>
                  <input
                    type="number"
                    placeholder="örn: 10000"
                    value={formData.intervalKm}
                    onChange={(e) => setFormData(p => ({ ...p, intervalKm: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Bakım Aralığı (Ay)
                  </label>
                  <input
                    type="number"
                    placeholder="örn: 12"
                    value={formData.intervalMonths}
                    onChange={(e) => setFormData(p => ({ ...p, intervalMonths: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Son Yapıldığı KM
                  </label>
                  <input
                    type="number"
                    value={formData.lastDoneKm}
                    onChange={(e) => setFormData(p => ({ ...p, lastDoneKm: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Son Yapıldığı Tarih
                </label>
                <input
                  type="date"
                  value={formData.lastDoneDate}
                  onChange={(e) => setFormData(p => ({ ...p, lastDoneDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Notlar / Parça Açıklaması
                </label>
                <input
                  type="text"
                  placeholder="örn: Motul 75W-90 tam sentetik dişli yağı..."
                  value={formData.notes}
                  onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={onCloseAddModal} className="px-4 py-2 text-xs rounded-xl text-slate-600">İptal</button>
                <button type="submit" className="px-5 py-2 text-xs font-medium rounded-xl bg-emerald-600 text-white">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
