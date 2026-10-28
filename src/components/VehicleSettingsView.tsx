import React, { useState } from 'react';
import { Vehicle, FuelType, TransmissionType } from '../types';
import { formatKm, formatDate } from '../utils/calculations';
import { 
  Car, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Wrench, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface VehicleSettingsViewProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (id: string) => void;
  onSaveVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (id: string) => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
}

export const VehicleSettingsView: React.FC<VehicleSettingsViewProps> = ({
  vehicles,
  activeVehicle,
  onSelectVehicle,
  onSaveVehicle,
  onDeleteVehicle,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [isEditing, setIsEditing] = useState(() => vehicles.length === 0);
  const [isAddingNew, setIsAddingNew] = useState(() => vehicles.length === 0);

  const [formData, setFormData] = useState<Partial<Vehicle>>(activeVehicle || {});

  const handleStartEdit = (veh: Vehicle) => {
    setFormData({ ...veh });
    setIsEditing(true);
    setIsAddingNew(false);
  };

  const handleStartAddNew = () => {
    setFormData({
      id: `veh-${Date.now()}`,
      plate: '',
      brand: '',
      model: '',
      subModel: '',
      year: new Date().getFullYear(),
      fuelType: 'benzin',
      transmission: 'manuel',
      currentKm: 0,
      engineOilSpec: '',
      inspectionDate: '',
      insuranceDate: '',
      cascoDate: '',
      color: '#3b82f6',
      notes: '',
    });
    setIsAddingNew(true);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plate || !formData.brand || !formData.model) {
      alert('Plaka, marka ve model zorunludur.');
      return;
    }

    const vehicleToSave: Vehicle = {
      id: formData.id || `veh-${Date.now()}`,
      plate: formData.plate.toUpperCase().trim(),
      brand: formData.brand.trim(),
      model: formData.model.trim(),
      subModel: formData.subModel?.trim(),
      year: Number(formData.year) || 2020,
      fuelType: (formData.fuelType as FuelType) || 'benzin',
      transmission: (formData.transmission as TransmissionType) || 'manuel',
      currentKm: Number(formData.currentKm) || 0,
      vin: formData.vin?.trim(),
      engineNo: formData.engineNo?.trim(),
      engineOilSpec: formData.engineOilSpec?.trim(),
      oilCapacityLiters: formData.oilCapacityLiters ? Number(formData.oilCapacityLiters) : undefined,
      inspectionDate: formData.inspectionDate || undefined,
      insuranceDate: formData.insuranceDate || undefined,
      cascoDate: formData.cascoDate || undefined,
      color: formData.color || '#3b82f6',
      notes: formData.notes?.trim(),
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveVehicle(vehicleToSave);
    setIsEditing(false);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-500" />
            <span>Araç Profili & Ayarlar</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Araç teknik detayları, şasi/motor bilgileri, periyodik yağ specleri ve veri yönetimi
          </p>
        </div>

        <button
          onClick={handleStartAddNew}
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yeni Araç Ekle</span>
        </button>
      </div>

      {/* Kayıtlı Araçlar Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vehicles.map((v) => {
          const isActive = activeVehicle?.id === v.id;
          return (
            <div
              key={v.id}
              className={`p-5 rounded-3xl border transition-all shadow-sm ${
                isActive
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-12 rounded-full flex-shrink-0"
                    style={{ backgroundColor: v.color || '#3b82f6' }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-lg text-slate-900 dark:text-white">
                        {v.plate}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase">
                          Aktif Araç
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                      {v.brand} {v.model}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {v.year} Model • {v.fuelType.toUpperCase()} • {v.transmission}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEdit(v)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Düzenle"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {vehicles.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`${v.plate} plakalı aracı ve tüm kayıtlarını silmek istediğinize emin misiniz?`)) {
                          onDeleteVehicle(v.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Aracı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Kilometre</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{formatKm(v.currentKm)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Muayene</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{formatDate(v.inspectionDate)}</span>
                </div>
                {!isActive && (
                  <button
                    onClick={() => onSelectVehicle(v.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-xs font-semibold transition-colors"
                  >
                    Seç ve Kullan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Araç Ekleme / Düzenleme Formu */}
      {isEditing && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-md">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-500" />
              <span>{isAddingNew ? 'Yeni Araç Kaydı' : `${formData.plate} Bilgilerini Düzenle`}</span>
            </h3>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Kapat
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Plaka *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: 34 ABC 123"
                  value={formData.plate || ''}
                  onChange={(e) => setFormData(p => ({ ...p, plate: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Marka *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: Volkswagen, Renault"
                  value={formData.brand || ''}
                  onChange={(e) => setFormData(p => ({ ...p, brand: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Model *
                </label>
                <input
                  type="text"
                  required
                  placeholder="örn: Golf, Megane"
                  value={formData.model || ''}
                  onChange={(e) => setFormData(p => ({ ...p, model: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Model Yılı
                </label>
                <input
                  type="number"
                  value={formData.year || 2020}
                  onChange={(e) => setFormData(p => ({ ...p, year: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Yakıt Türü
                </label>
                <select
                  value={formData.fuelType || 'benzin'}
                  onChange={(e) => setFormData(p => ({ ...p, fuelType: e.target.value as FuelType }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="benzin">Benzin</option>
                  <option value="dizel">Dizel</option>
                  <option value="lpg">Benzin & LPG</option>
                  <option value="hibrit">Hibrit</option>
                  <option value="elektrik">Tam Elektrik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Vites Türü
                </label>
                <select
                  value={formData.transmission || 'manuel'}
                  onChange={(e) => setFormData(p => ({ ...p, transmission: e.target.value as TransmissionType }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="manuel">Manuel Vites</option>
                  <option value="otomatik">Otomatik Vites</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Güncel Kilometre
                </label>
                <input
                  type="number"
                  value={formData.currentKm || 0}
                  onChange={(e) => setFormData(p => ({ ...p, currentKm: Number(e.target.value) }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Araç Rengi / İkon Rengi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color || '#3b82f6'}
                    onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                    className="w-10 h-9 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-slate-500">{formData.color}</span>
                </div>
              </div>
            </div>

            {/* Yağ Spesifikasyonu & Yasal Tarihler */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Motor Yağı Spesifikasyonu
                </label>
                <input
                  type="text"
                  placeholder="örn: 5W-30 VW 504.00/507.00 veya RN0720"
                  value={formData.engineOilSpec || ''}
                  onChange={(e) => setFormData(p => ({ ...p, engineOilSpec: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  TÜVTÜRK Muayene Tarihi
                </label>
                <input
                  type="date"
                  value={formData.inspectionDate || ''}
                  onChange={(e) => setFormData(p => ({ ...p, inspectionDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Trafik Sigortası Vade Tarihi
                </label>
                <input
                  type="date"
                  value={formData.insuranceDate || ''}
                  onChange={(e) => setFormData(p => ({ ...p, insuranceDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs rounded-xl text-slate-600 hover:bg-slate-100"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Veri Yedekleme & Sıfırlama Bölümü */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-indigo-500" />
          <span>Veri Yönetimi, Yedekleme & Geri Yükleme</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Uygulama verileriniz tamamen tarayıcınızın yerel hafızasında saklanır. Düzenli olarak yedek alabilir veya başka bir cihaza aktarabilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={onExportData}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Tüm Verileri Yedekle (JSON)</span>
          </button>

          <button
            type="button"
            onClick={onImportData}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs font-semibold transition-colors"
          >
            <Upload className="w-4 h-4 text-blue-500" />
            <span>Yedekten Geri Yükle</span>
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Örnek Demo Verileri Yeniden Yükle</span>
          </button>
        </div>
      </div>

    </div>
  );
};
