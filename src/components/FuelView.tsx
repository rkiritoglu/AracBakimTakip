import React, { useState } from 'react';
import { Vehicle, FuelRecord, FuelType } from '../types';
import { 
  formatCurrency, 
  formatKm, 
  formatDate, 
  calculateFuelStats 
} from '../utils/calculations';
import { 
  Fuel, 
  Plus, 
  Trash2, 
  Calendar, 
  Gauge, 
  CheckCircle, 
  HelpCircle, 
  TrendingDown, 
  X, 
  Edit3, 
  Sparkles 
} from 'lucide-react';

interface FuelViewProps {
  vehicle: Vehicle;
  records: FuelRecord[];
  onSaveRecord: (record: FuelRecord) => void;
  onDeleteRecord: (id: string) => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const FuelView: React.FC<FuelViewProps> = ({
  vehicle,
  records,
  onSaveRecord,
  onDeleteRecord,
  isOpenAddModal,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const stats = calculateFuelStats(records);
  const [editingRecord, setEditingRecord] = useState<FuelRecord | null>(null);

  const [formData, setFormData] = useState<{
    date: string;
    km: number;
    liters: string;
    pricePerLiter: string;
    totalCost: string;
    isFullTank: boolean;
    station: string;
    fuelType: FuelType;
    notes: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    km: vehicle.currentKm,
    liters: '45.0',
    pricePerLiter: '44.00',
    totalCost: '1980.00',
    isFullTank: true,
    station: 'Shell',
    fuelType: vehicle.fuelType,
    notes: '',
  });

  const openNewModal = () => {
    setEditingRecord(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      km: vehicle.currentKm,
      liters: '',
      pricePerLiter: stats.lastPricePerLiter ? stats.lastPricePerLiter.toString() : '44.00',
      totalCost: '',
      isFullTank: true,
      station: '',
      fuelType: vehicle.fuelType,
      notes: '',
    });
    onOpenAddModal();
  };

  const openEditModal = (rec: FuelRecord) => {
    setEditingRecord(rec);
    setFormData({
      date: rec.date,
      km: rec.km,
      liters: rec.liters.toString(),
      pricePerLiter: rec.pricePerLiter.toString(),
      totalCost: rec.totalCost.toString(),
      isFullTank: rec.isFullTank,
      station: rec.station || '',
      fuelType: rec.fuelType,
      notes: rec.notes || '',
    });
    onOpenAddModal();
  };

  // Akıllı otomatik hesaplayıcı
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

    onSaveRecord(newRec);
    onCloseAddModal();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Fuel className="w-6 h-6 text-blue-500" />
            <span>Yakıt & Tüketim Takibi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Yakıt dolum kayıtları, tüketim hesaplamaları (L/100km) ve kilometre başı maliyet
          </p>
        </div>

        <button
          onClick={openNewModal}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Yakıt Alımı Ekle</span>
        </button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ortalama Tüketim</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {stats.avgConsumptionL100 > 0 ? stats.avgConsumptionL100 : '-'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">Litre / 100km</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">İki tam depo dolumu arası hesaplanır</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">KM Başı Yakıt</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {stats.avgCostPerKm > 0 ? `${stats.avgCostPerKm} ₺` : '-'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ km</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ortalama yakıt birim maliyeti</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Toplam Alınan Yakıt</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {stats.totalLiters.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">Litre</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats.fillCount} dolum kaydı</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Toplam Harcama</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {formatCurrency(stats.totalCost)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Son Fiyat: {stats.lastPricePerLiter ? `${stats.lastPricePerLiter} ₺/L` : '-'}
          </p>
        </div>
      </div>

      {/* Kayıtlar Listesi */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Fuel className="w-4 h-4 text-blue-500" />
            <span>Yakıt Dolum Geçmişi</span>
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {records.length} Kayıt
          </span>
        </div>

        {records.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Fuel className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            Henüz yakıt kaydı girilmedi.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {records.map((rec) => (
              <div 
                key={rec.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                        {formatKm(rec.km)}
                      </span>
                      {rec.isFullTank ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Tam Depo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Kısmi Dolum
                        </span>
                      )}
                      {rec.station && (
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          • {rec.station}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(rec.date)}
                      </span>
                      <span>•</span>
                      <span>{rec.liters} L @ {rec.pricePerLiter.toFixed(2)} ₺/L</span>
                      {rec.notes && (
                        <>
                          <span>•</span>
                          <span className="italic">{rec.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  {/* Tüketim Değeri (L/100km) */}
                  <div className="text-left sm:text-right">
                    {rec.consumptionL100 ? (
                      <div>
                        <div className="font-mono font-bold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 sm:justify-end">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>{rec.consumptionL100} L / 100km</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {rec.costPerKm ? `${rec.costPerKm} ₺/km` : ''}
                        </div>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Hesaplanıyor...
                      </span>
                    )}
                  </div>

                  {/* Toplam Tutar */}
                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {formatCurrency(rec.totalCost)}
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(rec)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Bu yakıt kaydını silmek istediğinize emin misiniz?')) {
                          onDeleteRecord(rec.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* YENİ / DÜZENLE YAKIT MODALI */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            
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
                onClick={onCloseAddModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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

              {/* Litre, Birim Fiyat ve Toplam Tutar (Akıllı Senkronize) */}
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
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
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
                      placeholder="örn: 44.20"
                      value={formData.pricePerLiter}
                      onChange={(e) => handlePricePerLiterChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
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
                      placeholder="örn: 2010.00"
                      value={formData.totalCost}
                      onChange={(e) => handleTotalCostChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-blue-400 dark:border-blue-500 rounded-xl text-xs sm:text-sm font-mono font-extrabold text-blue-600 dark:text-blue-400 focus:outline-none"
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
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isFullTank}
                      onChange={(e) => setFormData(p => ({ ...p, isFullTank: e.target.checked }))}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Depo Tamamen Dolduruldu (Full Depo)
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400 block mt-0.5 ml-6">
                    L/100km tüketim hesabı için tam depo seçilmesi önerilir.
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Butonlar */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={onCloseAddModal}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
                >
                  {editingRecord ? 'Güncellemeleri Kaydet' : 'Yakıt Kaydını Ekle'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
