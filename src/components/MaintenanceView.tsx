import React, { useState } from 'react';
import { 
  Vehicle, 
  MaintenanceRecord, 
  MaintenancePart, 
  MaintenanceCategory 
} from '../types';
import { 
  formatCurrency, 
  formatKm, 
  formatDate 
} from '../utils/calculations';
import { 
  Wrench, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Package, 
  FileText, 
  MapPin, 
  Calendar, 
  Gauge, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  X 
} from 'lucide-react';

interface MaintenanceViewProps {
  vehicle: Vehicle;
  records: MaintenanceRecord[];
  onSaveRecord: (record: MaintenanceRecord) => void;
  onDeleteRecord: (id: string) => void;
  isOpenAddModal: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  vehicle,
  records,
  onSaveRecord,
  onDeleteRecord,
  isOpenAddModal,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRecordIds, setExpandedRecordIds] = useState<Record<string, boolean>>({});

  // Form State
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
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
    laborCost: 0,
    parts: [],
    notes: '',
    nextMaintenanceKm: vehicle.currentKm + 10000,
    nextMaintenanceDate: '',
  });

  const toggleExpand = (id: string) => {
    setExpandedRecordIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openNewModal = () => {
    setEditingRecord(null);
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
    onOpenAddModal();
  };

  const openEditModal = (rec: MaintenanceRecord) => {
    setEditingRecord(rec);
    setFormData({
      date: rec.date,
      km: rec.km,
      type: rec.type,
      title: rec.title,
      serviceName: rec.serviceName,
      serviceLocation: rec.serviceLocation || '',
      invoiceNumber: rec.invoiceNumber || '',
      laborCost: rec.laborCost,
      parts: rec.parts ? [...rec.parts] : [],
      notes: rec.notes || '',
      nextMaintenanceKm: rec.nextMaintenanceKm || '',
      nextMaintenanceDate: rec.nextMaintenanceDate || '',
    });
    onOpenAddModal();
  };

  // Dinamik Parça Ekleme & Silme
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

  // Parçalar toplamı ve genel toplam hesaplama
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

    onSaveRecord(newRecord);
    onCloseAddModal();
  };

  // Filtreleme
  const filteredRecords = records.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.parts?.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || r.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat: MaintenanceCategory) => {
    switch (cat) {
      case 'periyodik':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">Periyodik Bakım</span>;
      case 'agir':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">Ağır Bakım</span>;
      case 'onarım':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Arıza / Onarım</span>;
      case 'kaporta_boya':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Kaporta / Boya</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Genel Bakım</span>;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Üst Bar: Başlık, Arama ve Yeni Ekle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-500" />
            <span>Bakım & Parça Kayıtları</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Servis geçmişi, kullanılan yedek parçalar, parça kodları ve maliyet dökümleri
          </p>
        </div>

        <button
          onClick={openNewModal}
          type="button"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Bakım & Parça Ekle</span>
        </button>
      </div>

      {/* Arama ve Kategori Filtreleme */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Parça adı, servis veya işlem ara (örn: yağ filtresi, buji, fren balatası)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'periyodik', label: 'Periyodik' },
            { id: 'agir', label: 'Ağır Bakım' },
            { id: 'onarım', label: 'Onarım' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bakım Kayıtları Listesi */}
      {filteredRecords.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-8">
          <Wrench className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Bakım Kaydı Bulunamadı
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm ? 'Arama kriterlerinize uygun kayıt bulunamadı.' : 'Bu araç için henüz bakım veya parça kaydı girilmedi.'}
          </p>
          <button
            onClick={openNewModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium"
          >
            <Plus className="w-4 h-4" />
            İlk Bakım Kaydını Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => {
            const isExpanded = expandedRecordIds[record.id] !== false; // varsayılan açık
            const partsCount = record.parts?.length || 0;
            const partsTotal = record.parts?.reduce((sum, p) => sum + (p.totalPrice || 0), 0) || 0;

            return (
              <div
                key={record.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden transition-all hover:border-indigo-300 dark:hover:border-indigo-600"
              >
                {/* Kart Başlığı */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {record.title}
                        </h3>
                        {getCategoryBadge(record.type)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-mono font-medium text-slate-700 dark:text-slate-200">
                          <Gauge className="w-3.5 h-3.5 text-blue-500" />
                          {formatKm(record.km)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(record.date)}
                        </span>
                        {record.serviceName && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-400" />
                              {record.serviceName} {record.serviceLocation ? `(${record.serviceLocation})` : ''}
                            </span>
                          </>
                        )}
                        {record.invoiceNumber && (
                          <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            Fatura: {record.invoiceNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-bold font-mono text-slate-900 dark:text-white">
                        {formatCurrency(record.totalCost)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {partsCount > 0 ? `${partsCount} Parça + İşçilik` : 'Sadece İşçilik'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(record)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Bu bakım kaydını silmek istediğinize emin misiniz?')) {
                            onDeleteRecord(record.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleExpand(record.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors ml-1"
                        title={isExpanded ? 'Detayları Gizle' : 'Detayları Göster'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Açılabilir Parça Listesi ve Detaylar */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Parçalar Tablosu */}
                    {partsCount > 0 ? (
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Kullanılan Yedek Parçalar & Sıvılar</span>
                        </h4>

                        <div className="border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 dark:bg-slate-750 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                              <tr>
                                <th className="px-3.5 py-2 font-semibold">Parça Adı / Açıklama</th>
                                <th className="px-3 py-2 font-semibold">Marka</th>
                                <th className="px-3 py-2 font-semibold">Parça Kodu (OEM)</th>
                                <th className="px-3 py-2 font-semibold text-center">Adet</th>
                                <th className="px-3 py-2 font-semibold text-right">Birim Fiyat</th>
                                <th className="px-3.5 py-2 font-semibold text-right">Toplam Fiyat</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                              {record.parts.map((part) => (
                                <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30">
                                  <td className="px-3.5 py-2.5 font-medium text-slate-900 dark:text-white">
                                    {part.name}
                                  </td>
                                  <td className="px-3 py-2.5 text-slate-600 dark:text-slate-300">
                                    {part.brand || '-'}
                                  </td>
                                  <td className="px-3 py-2.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                    {part.partNumber || '-'}
                                  </td>
                                  <td className="px-3 py-2.5 text-center font-mono text-slate-700 dark:text-slate-200">
                                    {part.quantity}
                                  </td>
                                  <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                    {formatCurrency(part.unitPrice)}
                                  </td>
                                  <td className="px-3.5 py-2.5 text-right font-mono font-semibold text-slate-900 dark:text-white">
                                    {formatCurrency(part.totalPrice)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50/80 dark:bg-slate-750/80 font-medium text-slate-700 dark:text-slate-200 border-t border-slate-200 dark:border-slate-700">
                              <tr>
                                <td colSpan={5} className="px-3.5 py-2 text-right">
                                  Parçalar Alt Toplamı:
                                </td>
                                <td className="px-3.5 py-2 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                  {formatCurrency(partsTotal)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={5} className="px-3.5 py-2 text-right">
                                  İşçilik & Servis Ücreti:
                                </td>
                                <td className="px-3.5 py-2 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                  {formatCurrency(record.laborCost)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-750/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                        Bu bakımda kayıtlı yedek parça bulunmuyor. Sadece işçilik/servis ücreti ({formatCurrency(record.laborCost)}) girilmiştir.
                      </div>
                    )}

                    {/* Notlar ve Sonraki Bakım Hedefi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {record.notes && (
                        <div className="bg-slate-50 dark:bg-slate-750/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                            Usta / Servis Notları:
                          </span>
                          <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                            {record.notes}
                          </p>
                        </div>
                      )}

                      {(record.nextMaintenanceKm || record.nextMaintenanceDate) && (
                        <div className="bg-blue-50/60 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-900/40">
                          <span className="font-semibold text-blue-900 dark:text-blue-300 block mb-1">
                            Sıradaki Bakım Hedefi:
                          </span>
                          <div className="text-blue-800 dark:text-blue-200 flex items-center gap-3">
                            {record.nextMaintenanceKm && (
                              <span>Hedef KM: <strong className="font-mono">{formatKm(record.nextMaintenanceKm)}</strong></span>
                            )}
                            {record.nextMaintenanceDate && (
                              <span>Hedef Tarih: <strong>{formatDate(record.nextMaintenanceDate)}</strong></span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* YENİ / DÜZENLE BAKIM MODALI */}
      {isOpenAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 my-8 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Başlığı */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingRecord ? 'Bakım Kaydını Düzenle' : 'Yeni Bakım & Parça Kaydı'}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
              {/* Temel Bilgiler */}
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
                    <option value="agir">Ağır Bakım (Triger, Debriyaj vs.)</option>
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

              {/* KM, Servis ve Fatura */}
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

              {/* Kullanılan Parçalar ve Fiyatları (Dinamik Repeater) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-indigo-500" />
                    <span>Bakımda Kullanılan Parçalar & Sıvılar ({formData.parts.length})</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddPart}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Parça Ekle
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {formData.parts.length === 0 ? (
                    <div className="text-center py-4 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                      Henüz parça eklenmedi. Parça eklemek için yukarıdaki "+ Parça Ekle" butonuna tıklayınız.
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

                        <div className="col-span-4 sm:col-span-1 flex items-center justify-end">
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

              {/* İşçilik ve Genel Toplam Özeti */}
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

              {/* Notlar ve Sonraki Bakım Tahmini */}
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
                  placeholder="Karter tapası yenilendi, fren hidroliği seviyesi ve antifriz -35°C ölçüldü..."
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
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
                >
                  {editingRecord ? 'Güncellemeleri Kaydet' : 'Bakım Kaydını Ekle'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
