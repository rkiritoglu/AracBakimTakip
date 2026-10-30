import React, { useState, useEffect } from 'react';
import { Vehicle, MaintenanceRecord, MaintenancePart, MaintenanceCategory } from '../../types';
import { Wrench, Plus, Trash2, Package, X } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface AddMaintenanceModalProps {
  isOpen: boolean;
  vehicle: Vehicle;
  editingRecord?: MaintenanceRecord | null;
  onSave: (record: MaintenanceRecord) => void;
  onClose: () => void;
}

export const AddMaintenanceModal: React.FC<AddMaintenanceModalProps> = ({
  isOpen,
  vehicle,
  editingRecord,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<{
    date: string;
    km: number;
    type: MaintenanceCategory;
    title: string;
    serviceName: string;
    serviceLocation: string;
    invoiceNumber: string;
    laborCost: number;
    parts: MaintenancePart[];
    notes: string;
    nextMaintenanceKm: number | '';
    nextMaintenanceDate: string;
  }>({
    date: new Date().toISOString().split('T')[0],
    km: vehicle.currentKm,
    type: 'periyodik',
    title: 'Periyodik Bakım',
    serviceName: '',
    serviceLocation: '',
    invoiceNumber: '',
    laborCost: 1000,
    parts: [
      {
        id: `part-${Date.now()}-1`,
        name: 'Motor Yağı (4L-5L)',
        brand: '',
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
      },
      {
        id: `part-${Date.now()}-2`,
        name: 'Yağ Filtresi',
        brand: '',
        quantity: 1,
        unitPrice: 350,
        totalPrice: 350,
      },
      {
        id: `part-${Date.now()}-3`,
        name: 'Hava Filtresi',
        brand: '',
        quantity: 1,
        unitPrice: 400,
        totalPrice: 400,
      },
      {
        id: `part-${Date.now()}-4`,
        name: 'Polen Filtresi',
        brand: '',
        quantity: 1,
        unitPrice: 450,
        totalPrice: 450,
      }
    ],
    notes: '',
    nextMaintenanceKm: vehicle.currentKm + 10000,
    nextMaintenanceDate: '',
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        date: editingRecord.date,
        km: editingRecord.km,
        type: editingRecord.type,
        title: editingRecord.title,
        serviceName: editingRecord.serviceName,
        serviceLocation: editingRecord.serviceLocation || '',
        invoiceNumber: editingRecord.invoiceNumber || '',
        laborCost: editingRecord.laborCost,
        parts: editingRecord.parts ? [...editingRecord.parts] : [],
        notes: editingRecord.notes || '',
        nextMaintenanceKm: editingRecord.nextMaintenanceKm || '',
        nextMaintenanceDate: editingRecord.nextMaintenanceDate || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        km: vehicle.currentKm,
        type: 'periyodik',
        title: 'Periyodik Bakım',
        serviceName: '',
        serviceLocation: '',
        invoiceNumber: '',
        laborCost: 1000,
        parts: [
          {
            id: `part-${Date.now()}-1`,
            name: 'Motor Yağı (4L-5L)',
            brand: '',
            quantity: 1,
            unitPrice: 1500,
            totalPrice: 1500,
          },
          {
            id: `part-${Date.now()}-2`,
            name: 'Yağ Filtresi',
            brand: '',
            quantity: 1,
            unitPrice: 350,
            totalPrice: 350,
          },
          {
            id: `part-${Date.now()}-3`,
            name: 'Hava Filtresi',
            brand: '',
            quantity: 1,
            unitPrice: 400,
            totalPrice: 400,
          },
          {
            id: `part-${Date.now()}-4`,
            name: 'Polen Filtresi',
            brand: '',
            quantity: 1,
            unitPrice: 450,
            totalPrice: 450,
          }
        ],
        notes: '',
        nextMaintenanceKm: vehicle.currentKm + 10000,
        nextMaintenanceDate: '',
      });
    }
  }, [editingRecord, vehicle, isOpen]);

  if (!isOpen) return null;

  const handleAddPart = () => {
    setFormData(prev => ({
      ...prev,
      parts: [
        ...prev.parts,
        {
          id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: '',
          brand: '',
          partNumber: '',
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        }
      ]
    }));
  };

  const handleUpdatePart = (index: number, field: keyof MaintenancePart, value: any) => {
    setFormData(prev => {
      const updatedParts = [...prev.parts];
      const part = { ...updatedParts[index], [field]: value };
      
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = field === 'quantity' ? Number(value) : part.quantity;
        const price = field === 'unitPrice' ? Number(value) : part.unitPrice;
        part.totalPrice = Number((qty * price).toFixed(2));
      }
      
      updatedParts[index] = part;
      return { ...prev, parts: updatedParts };
    });
  };

  const handleRemovePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parts: prev.parts.filter((_, i) => i !== index),
    }));
  };

  const partsSum = formData.parts.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
  const totalCost = Number((partsSum + (Number(formData.laborCost) || 0)).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: MaintenanceRecord = {
      id: editingRecord ? editingRecord.id : `maint-${Date.now()}`,
      vehicleId: vehicle.id,
      date: formData.date,
      km: Number(formData.km),
      type: formData.type,
      title: formData.title || 'Bakım Kaydı',
      serviceName: formData.serviceName || 'Özel Servis',
      serviceLocation: formData.serviceLocation,
      invoiceNumber: formData.invoiceNumber,
      laborCost: Number(formData.laborCost) || 0,
      parts: formData.parts.filter(p => p.name.trim() !== ''),
      totalCost,
      notes: formData.notes,
      nextMaintenanceKm: formData.nextMaintenanceKm ? Number(formData.nextMaintenanceKm) : undefined,
      nextMaintenanceDate: formData.nextMaintenanceDate || undefined,
      createdAt: editingRecord ? editingRecord.createdAt : new Date().toISOString(),
    };

    onSave(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150 overflow-hidden">
        
        {/* Sabit Üst Başlık (Header) */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {editingRecord ? 'Bakım Kaydını Düzenle' : 'Yeni Bakım & Parça Kaydı'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {vehicle.plate} • {vehicle.brand} {vehicle.model}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60 rounded-xl transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden">
          
          {/* Kaydırılabilir İçerik Alanı */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Bakım Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="örn: 120.000 KM Periyodik Bakım"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Bakım Türü *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(p => ({ ...p, type: e.target.value as MaintenanceCategory }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="periyodik">Periyodik Bakım</option>
                  <option value="agir">Ağır Bakım (Triger, Debriyaj vb.)</option>
                  <option value="onarım">Arıza / Mekanik Onarım</option>
                  <option value="kaporta_boya">Kaporta / Boya</option>
                  <option value="diger">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Bakım Tarihi *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Servis / Usta Adı
                </label>
                <input
                  type="text"
                  value={formData.serviceName}
                  onChange={(e) => setFormData(p => ({ ...p, serviceName: e.target.value }))}
                  placeholder="örn: Yetkili Servis veya Bosch Car Service"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Fatura / Fiş No
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData(p => ({ ...p, invoiceNumber: e.target.value }))}
                  placeholder="örn: FTR-2026-0012"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Parçalar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-indigo-500" />
                  <span>Kullanılan Parçalar & Sıvılar ({formData.parts.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Parça Ekle
                </button>
              </div>

              <div className="space-y-2">
                {formData.parts.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    Henüz parça eklenmedi. Parça eklemek için "+ Parça Ekle" butonuna tıklayınız.
                  </div>
                ) : (
                  formData.parts.map((part, idx) => (
                    <div 
                      key={part.id} 
                      className="grid grid-cols-12 gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/70 items-center text-xs"
                    >
                      <div className="col-span-12 sm:col-span-4">
                        <input
                          type="text"
                          required
                          placeholder="Parça Adı (örn: Yağ Filtresi)"
                          value={part.name}
                          onChange={(e) => handleUpdatePart(idx, 'name', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <input
                          type="text"
                          placeholder="Marka (Mann, Castrol)"
                          value={part.brand || ''}
                          onChange={(e) => handleUpdatePart(idx, 'brand', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2">
                        <input
                          type="text"
                          placeholder="OEM / Parça No"
                          value={part.partNumber || ''}
                          onChange={(e) => handleUpdatePart(idx, 'partNumber', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono text-[11px] focus:outline-none"
                        />
                      </div>

                      <div className="col-span-3 sm:col-span-1">
                        <input
                          type="number"
                          min={1}
                          placeholder="Adet"
                          value={part.quantity}
                          onChange={(e) => handleUpdatePart(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-center font-mono focus:outline-none"
                        />
                      </div>

                      <div className="col-span-4 sm:col-span-2">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          placeholder="Birim Fiyat"
                          value={part.unitPrice}
                          onChange={(e) => handleUpdatePart(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-right font-mono focus:outline-none"
                        />
                      </div>

                      <div className="col-span-5 sm:col-span-1 flex items-center justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemovePart(idx)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Parçayı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* İşçilik ve Toplam */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    İşçilik & Servis Ücreti (₺)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={formData.laborCost}
                    onChange={(e) => setFormData(p => ({ ...p, laborCost: Number(e.target.value) }))}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="text-right sm:text-center text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block">Parçalar Toplamı</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {formatCurrency(partsSum)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block uppercase">
                    Genel Toplam Tutar
                  </span>
                  <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-lg sm:text-xl">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sonraki Bakım Hedefi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Sonraki Bakım Kilometresi (Opsiyonel)
                </label>
                <input
                  type="number"
                  value={formData.nextMaintenanceKm}
                  onChange={(e) => setFormData(p => ({ ...p, nextMaintenanceKm: e.target.value ? Number(e.target.value) : '' }))}
                  placeholder="örn: 130000"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Sonraki Bakım Tarihi (Opsiyonel)
                </label>
                <input
                  type="date"
                  value={formData.nextMaintenanceDate}
                  onChange={(e) => setFormData(p => ({ ...p, nextMaintenanceDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                Yapılan İşlemler & Servis Notları
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))}
                placeholder="Karter tapası yenilendi, filtreler orijinal takıldı..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

          </div>

          {/* Sabit Alt Bar (Toplam & Kaydet Butonları) */}
          <div className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/70 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Toplam Tutar:</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-base sm:text-lg">
                {formatCurrency(totalCost)}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              >
                {editingRecord ? 'Güncellemeleri Kaydet' : 'Bakım Kaydını Ekle'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
