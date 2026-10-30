import React, { useState, useEffect } from 'react';
import { Vehicle, TireSet, TireSeason } from '../../types';
import { Disc, X } from 'lucide-react';

interface AddTireModalProps {
  isOpen: boolean;
  vehicle: Vehicle;
  editingTire?: TireSet | null;
  isFirstTire?: boolean;
  onSave: (tire: TireSet) => void;
  onClose: () => void;
}

export const AddTireModal: React.FC<AddTireModalProps> = ({
  isOpen,
  vehicle,
  editingTire,
  isFirstTire = false,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<{
    season: TireSeason;
    brand: string;
    model: string;
    size: string;
    dot: string;
    treadDepthMm: number;
    purchaseDate: string;
    purchaseKm: number;
    purchasePrice: number;
    isCurrentlyInstalled: boolean;
    storageLocation: string;
    notes: string;
  }>({
    season: 'yazlik',
    brand: '',
    model: '',
    size: '205/55 R16',
    dot: '',
    treadDepthMm: 8.0,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseKm: vehicle.currentKm,
    purchasePrice: 8000,
    isCurrentlyInstalled: isFirstTire,
    storageLocation: 'Araç üzerinde takılı',
    notes: '',
  });

  useEffect(() => {
    if (editingTire) {
      setFormData({
        season: editingTire.season,
        brand: editingTire.brand,
        model: editingTire.model,
        size: editingTire.size,
        dot: editingTire.dot || '',
        treadDepthMm: editingTire.treadDepthMm || 8.0,
        purchaseDate: editingTire.purchaseDate || '',
        purchaseKm: editingTire.purchaseKm || vehicle.currentKm,
        purchasePrice: editingTire.purchasePrice || 0,
        isCurrentlyInstalled: editingTire.isCurrentlyInstalled,
        storageLocation: editingTire.storageLocation || '',
        notes: editingTire.notes || '',
      });
    } else {
      setFormData({
        season: 'yazlik',
        brand: '',
        model: '',
        size: '205/55 R16',
        dot: '',
        treadDepthMm: 8.0,
        purchaseDate: new Date().toISOString().split('T')[0],
        purchaseKm: vehicle.currentKm,
        purchasePrice: 8000,
        isCurrentlyInstalled: isFirstTire,
        storageLocation: isFirstTire ? 'Araç üzerinde takılı' : '',
        notes: '',
      });
    }
  }, [editingTire, vehicle, isFirstTire, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand || !formData.size) {
      alert('Lütfen lastik markası ve ebadını giriniz.');
      return;
    }

    const newTire: TireSet = {
      id: editingTire ? editingTire.id : `tire-${Date.now()}`,
      vehicleId: vehicle.id,
      season: formData.season,
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      size: formData.size.trim(),
      dot: formData.dot.trim() || undefined,
      treadDepthMm: Number(formData.treadDepthMm),
      purchaseDate: formData.purchaseDate || undefined,
      purchaseKm: Number(formData.purchaseKm) || 0,
      purchasePrice: Number(formData.purchasePrice) || 0,
      isCurrentlyInstalled: formData.isCurrentlyInstalled,
      lastMountedDate: formData.isCurrentlyInstalled ? (editingTire?.lastMountedDate || new Date().toISOString().split('T')[0]) : undefined,
      lastMountedKm: formData.isCurrentlyInstalled ? (editingTire?.lastMountedKm || vehicle.currentKm) : undefined,
      totalKmUsed: editingTire ? editingTire.totalKmUsed : 0,
      storageLocation: formData.storageLocation.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      createdAt: editingTire ? editingTire.createdAt : new Date().toISOString(),
    };

    onSave(newTire);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{editingTire ? 'Lastik Setini Düzenle' : 'Yeni Lastik Seti Ekle'}</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Mevsim *</label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData(p => ({ ...p, season: e.target.value as TireSeason }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="yazlik">☀️ Yazlık Lastik</option>
                  <option value="kislik">❄️ Kışlık Lastik</option>
                  <option value="dort_mevsim">🌿 Dört Mevsim</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Ebat *</label>
                <input
                  type="text"
                  required
                  placeholder="örn: 205/55 R16 91V"
                  value={formData.size}
                  onChange={(e) => setFormData(p => ({ ...p, size: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Marka *</label>
                <input
                  type="text"
                  required
                  placeholder="örn: Continental, Michelin"
                  value={formData.brand}
                  onChange={(e) => setFormData(p => ({ ...p, brand: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Model</label>
                <input
                  type="text"
                  placeholder="örn: PremiumContact 6"
                  value={formData.model}
                  onChange={(e) => setFormData(p => ({ ...p, model: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">DOT Tarihi (Hafta/Yıl)</label>
                <input
                  type="text"
                  placeholder="örn: 4223 (2023 42. Hafta)"
                  value={formData.dot}
                  onChange={(e) => setFormData(p => ({ ...p, dot: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Diş Derinliği (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="12"
                  value={formData.treadDepthMm}
                  onChange={(e) => setFormData(p => ({ ...p, treadDepthMm: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Satın Alma Tarihi</label>
                <input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) => setFormData(p => ({ ...p, purchaseDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Satın Alma KM</label>
                <input
                  type="number"
                  value={formData.purchaseKm}
                  onChange={(e) => setFormData(p => ({ ...p, purchaseKm: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Fiyat (₺)</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData(p => ({ ...p, purchasePrice: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Saklama Yeri / Lastik Oteli</label>
              <input
                type="text"
                placeholder="örn: Lastik Park Maslak (Fiş: 1245) veya Garaj"
                value={formData.storageLocation}
                onChange={(e) => setFormData(p => ({ ...p, storageLocation: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isCurrentlyInstalled}
                  onChange={(e) => setFormData(p => ({ ...p, isCurrentlyInstalled: e.target.checked }))}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Bu seti şu anda araçta takılı olarak ayarla
                </span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 shrink-0">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors">
              İptal
            </button>
            <button type="submit" className="px-5 py-2 text-xs font-medium rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
