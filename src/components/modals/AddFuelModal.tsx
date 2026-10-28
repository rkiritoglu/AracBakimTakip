import React, { useState, useEffect } from 'react';
import { Vehicle, FuelRecord, FuelType } from '../../types';
import { Fuel, X } from 'lucide-react';

interface AddFuelModalProps {
  isOpen: boolean;
  vehicle: Vehicle;
  lastPrice?: number | null;
  editingRecord?: FuelRecord | null;
  onSave: (record: FuelRecord) => void;
  onClose: () => void;
}

export const AddFuelModal: React.FC<AddFuelModalProps> = ({
  isOpen,
  vehicle,
  lastPrice,
  editingRecord,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    km: vehicle.currentKm,
    liters: '',
    pricePerLiter: lastPrice ? lastPrice.toString() : '44.50',
    totalCost: '',
    isFullTank: true,
    station: '',
    fuelType: vehicle.fuelType,
    notes: '',
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        date: editingRecord.date,
        km: editingRecord.km,
        liters: editingRecord.liters.toString(),
        pricePerLiter: editingRecord.pricePerLiter.toString(),
        totalCost: editingRecord.totalCost.toString(),
        isFullTank: editingRecord.isFullTank,
        station: editingRecord.station || '',
        fuelType: editingRecord.fuelType,
        notes: editingRecord.notes || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        km: vehicle.currentKm,
        liters: '',
        pricePerLiter: lastPrice ? lastPrice.toString() : '44.50',
        totalCost: '',
        isFullTank: true,
        station: '',
        fuelType: vehicle.fuelType,
        notes: '',
      });
    }
  }, [editingRecord, vehicle, lastPrice, isOpen]);

  if (!isOpen) return null;

  // Akıllı otomatik senkronizasyon
  const handleLitersChange = (val: string) => {
    const l = parseFloat(val);
    const p = parseFloat(formData.pricePerLiter);
    setFormData(prev => ({
      ...prev,
      liters: val,
      totalCost: (!isNaN(l) && !isNaN(p)) ? (l * p).toFixed(2) : prev.totalCost,
    }));
  };

  const handlePricePerLiterChange = (val: string) => {
    const p = parseFloat(val);
    const l = parseFloat(formData.liters);
    setFormData(prev => ({
      ...prev,
      pricePerLiter: val,
      totalCost: (!isNaN(l) && !isNaN(p)) ? (l * p).toFixed(2) : prev.totalCost,
    }));
  };

  const handleTotalCostChange = (val: string) => {
    const t = parseFloat(val);
    const p = parseFloat(formData.pricePerLiter);
    setFormData(prev => ({
      ...prev,
      totalCost: val,
      liters: (!isNaN(t) && !isNaN(p) && p > 0) ? (t / p).toFixed(2) : prev.liters,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const litersNum = parseFloat(formData.liters);
    const priceNum = parseFloat(formData.pricePerLiter);
    const totalCostNum = parseFloat(formData.totalCost);

    if (isNaN(litersNum) || isNaN(totalCostNum)) {
      alert('Lütfen geçerli yakıt miktarı ve tutar giriniz.');
      return;
    }

    const newRec: FuelRecord = {
      id: editingRecord ? editingRecord.id : `fuel-${Date.now()}`,
      vehicleId: vehicle.id,
      date: formData.date,
      km: Number(formData.km),
      liters: litersNum,
      pricePerLiter: !isNaN(priceNum) ? priceNum : Number((totalCostNum / litersNum).toFixed(2)),
      totalCost: totalCostNum,
      isFullTank: formData.isFullTank,
      station: formData.station.trim() || undefined,
      fuelType: formData.fuelType,
      notes: formData.notes.trim() || undefined,
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
    };

    onSave(newRec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {editingRecord ? 'Yakıt Kaydını Düzenle' : 'Yeni Yakıt Alımı Ekle'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {vehicle.plate} • {vehicle.brand} {vehicle.model}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Tarih & KM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Tarih *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Gösterge Kilometresi *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.km}
                onChange={(e) => setFormData(p => ({ ...p, km: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Litre, Birim Fiyat ve Toplam Tutar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Yakıt & Fiyat Hesaplayıcı
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Alınan Litre *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="örn: 45.5"
                  value={formData.liters}
                  onChange={(e) => handleLitersChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Litre Fiyatı (₺) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="örn: 44.50"
                  value={formData.pricePerLiter}
                  onChange={(e) => handlePricePerLiterChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Toplam Tutar (₺) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="örn: 2025.00"
                  value={formData.totalCost}
                  onChange={(e) => handleTotalCostChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-500 rounded-xl text-xs sm:text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* İstasyon & Tam Depo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                İstasyon / Marka
              </label>
              <input
                type="text"
                placeholder="örn: Shell, Opet, BP..."
                value={formData.station}
                onChange={(e) => setFormData(p => ({ ...p, station: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFullTank}
                  onChange={(e) => setFormData(p => ({ ...p, isFullTank: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Tam Depo Dolduruldu
                </span>
              </label>
              <span className="text-[11px] text-slate-400 block mt-0.5 ml-6">
                L/100km tüketim hesabı için önerilir
              </span>
            </div>
          </div>

          {/* Notlar */}
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
              Notlar
            </label>
            <input
              type="text"
              placeholder="Uzun yol, klima açık vs."
              value={formData.notes}
              onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              {editingRecord ? 'Güncellemeleri Kaydet' : 'Yakıt Kaydını Ekle'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
