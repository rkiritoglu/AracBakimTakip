import React, { useState } from 'react';
import { 
  Vehicle, 
  MaintenanceRecord, 
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
  MapPin, 
  Calendar, 
  Gauge, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

interface MaintenanceViewProps {
  vehicle: Vehicle;
  records: MaintenanceRecord[];
  onOpenAddModal: () => void;
  onEditRecord: (record: MaintenanceRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  vehicle,
  records,
  onOpenAddModal,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRecordIds, setExpandedRecordIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRecordIds(prev => ({ ...prev, [id]: !prev[id] }));
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
          onClick={onOpenAddModal}
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
            onClick={onOpenAddModal}
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
                        onClick={() => onEditRecord(record)}
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

    </div>
  );
};
