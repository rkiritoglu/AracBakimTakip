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
      totalCost: (!isNaN(p) && !isNaN(l)) ? (l * p).toFixed(2) : prev.totalCost,
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
    const totalCostNum = parseFloat(formData.totalCost);
    const priceNum = parseFloat(formData.pricePerLiter);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {editingRecord ? 'Yakıt Kaydını Düzenle' : 'Yeni Yakıt Alımı Ekle'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Tarih & KM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Alım Tarihi *
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
                  Kilometre *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={formData.km}
                  onChange={(e) => setFormData(p => ({ ...p, km: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Yakıt Türü & İstasyon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Yakıt Türü
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData(p => ({ ...p, fuelType: e.target.value as FuelType }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="benzin">Benzin</option>
                  <option value="dizel">Dizel / Motorin</option>
                  <option value="lpg">LPG / Otogaz</option>
                  <option value="hibrit">Hibrit</option>
                  <option value="elektrik">Elektrik (kWh)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Akaryakıt İstasyonu
                </label>
                <input
                  type="text"
                  placeholder="örn: Shell, Opet, BP"
                  value={formData.station}
                  onChange={(e) => setFormData(p => ({ ...p, station: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Litre & Birim Fiyat & Tutar */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Litre (Miktar) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    placeholder="45.00"
                    value={formData.liters}
                    onChange={(e) => handleLitersChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Litre Fiyatı (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="44.50"
                    value={formData.pricePerLiter}
                    onChange={(e) => handlePricePerLiterChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Toplam Tutar (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="2000"
                    value={formData.totalCost}
                    onChange={(e) => handleTotalCostChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-blue-400 dark:border-blue-600 rounded-xl font-mono font-bold text-blue-600 dark:text-blue-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="fullTank"
                  checked={formData.isFullTank}
                  onChange={(e) => setFormData(p => ({ ...p, isFullTank: e.target.checked }))}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="fullTank" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Depo Tamamen Dolduruldu (Hassas tüketim hesabı için önerilir)
                </label>
              </div>
            </div>

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

          </div>

          {/* Butonlar */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/60 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
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
