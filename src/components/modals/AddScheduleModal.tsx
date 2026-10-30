import React, { useState, useEffect } from 'react';
import { Vehicle, MaintenanceScheduleItem } from '../../types';
import { CalendarClock, X } from 'lucide-react';

interface AddScheduleModalProps {
  isOpen: boolean;
  vehicle: Vehicle;
  editingItem?: MaintenanceScheduleItem | null;
  onSave: (item: MaintenanceScheduleItem) => void;
  onClose: () => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  vehicle,
  editingItem,
  onSave,
  onClose,
}) => {
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

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        category: editingItem.category,
        intervalKm: editingItem.intervalKm ? editingItem.intervalKm.toString() : '',
        intervalMonths: editingItem.intervalMonths ? editingItem.intervalMonths.toString() : '',
        lastDoneKm: editingItem.lastDoneKm !== undefined ? editingItem.lastDoneKm.toString() : '',
        lastDoneDate: editingItem.lastDoneDate || '',
        notes: editingItem.notes || '',
      });
    } else {
      setFormData({
        title: '',
        category: 'periyodik',
        intervalKm: '10000',
        intervalMonths: '12',
        lastDoneKm: vehicle.currentKm.toString(),
        lastDoneDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [editingItem, vehicle, isOpen]);

  if (!isOpen) return null;

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

    onSave(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{editingItem ? 'Bakım Planını Düzenle' : 'Yeni Bakım Planı / Hatırlatıcı'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="periyodik">Periyodik Bakım</option>
                  <option value="sivi">Sıvı & Yağ</option>
                  <option value="parca">Parça & Filtre</option>
                  <option value="agir">Ağır Bakım</option>
                  <option value="lastik">Lastik & Fren</option>
                  <option value="yasal">Muayene & Sigorta</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Aralık (KM)
                </label>
                <input
                  type="number"
                  placeholder="örn: 10000"
                  value={formData.intervalKm}
                  onChange={(e) => setFormData(p => ({ ...p, intervalKm: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Aralık (Ay)
                </label>
                <input
                  type="number"
                  placeholder="örn: 12"
                  value={formData.intervalMonths}
                  onChange={(e) => setFormData(p => ({ ...p, intervalMonths: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
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
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Notlar / Parça Açıklaması
              </label>
              <input
                type="text"
                placeholder="örn: Tam sentetik dişli yağı..."
                value={formData.notes}
                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors">
              İptal
            </button>
            <button type="submit" className="px-5 py-2 text-xs font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
