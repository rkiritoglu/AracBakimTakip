import React, { useState } from 'react';
import { Vehicle, TireSet, BatteryRecord, TireSeason, BatteryTechnology } from '../types';
import { 
  formatCurrency, 
  formatKm, 
  formatDate, 
  calculateDaysBetween 
} from '../utils/calculations';
import { 
  Disc, 
  BatteryCharging, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  RefreshCw, 
  Edit3, 
  ShieldCheck, 
  Calendar, 
  Gauge, 
  Zap, 
  AlertTriangle, 
  X, 
  Info 
} from 'lucide-react';

interface TiresAndBatteryViewProps {
  vehicle: Vehicle;
  tires: TireSet[];
  batteries: BatteryRecord[];
  onSaveTire: (tire: TireSet) => void;
  onDeleteTire: (id: string) => void;
  onMountTire: (tireId: string, currentKm: number) => void;
  onSaveBattery: (battery: BatteryRecord) => void;
  onDeleteBattery: (id: string) => void;
  isOpenAddTireModal: boolean;
  onCloseAddTireModal: () => void;
  onOpenAddTireModal: () => void;
}

export const TiresAndBatteryView: React.FC<TiresAndBatteryViewProps> = ({
  vehicle,
  tires,
  batteries,
  onSaveTire,
  onDeleteTire,
  onMountTire,
  onSaveBattery,
  onDeleteBattery,
  isOpenAddTireModal,
  onCloseAddTireModal,
  onOpenAddTireModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tires' | 'battery'>('tires');
  
  // Tire Form
  const [editingTire, setEditingTire] = useState<TireSet | null>(null);
  const [tireFormData, setTireFormData] = useState<{
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
    isCurrentlyInstalled: tires.length === 0,
    storageLocation: 'Araç üzerinde takılı',
    notes: '',
  });

  // Battery Modal & Form
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [editingBattery, setEditingBattery] = useState<BatteryRecord | null>(null);
  const [batteryFormData, setBatteryFormData] = useState<{
    brand: string;
    model: string;
    capacityAh: number;
    ccaA: number;
    technology: BatteryTechnology;
    changeDate: string;
    changeKm: number;
    cost: number;
    vendor: string;
    warrantyMonths: number;
    voltage: number;
    notes: string;
  }>({
    brand: 'Varta',
    model: 'Silver Dynamic',
    capacityAh: 70,
    ccaA: 760,
    technology: 'agm',
    changeDate: new Date().toISOString().split('T')[0],
    changeKm: vehicle.currentKm,
    cost: 4500,
    vendor: '',
    warrantyMonths: 24,
    voltage: 12.6,
    notes: '',
  });

  // Quick Tread Depth edit
  const [editingTreadTireId, setEditingTreadTireId] = useState<string | null>(null);
  const [newTreadValue, setNewTreadValue] = useState<number>(6.0);

  // Tire Open Handlers
  const handleOpenNewTire = () => {
    setEditingTire(null);
    setTireFormData({
      season: 'yazlik',
      brand: '',
      model: '',
      size: '205/55 R16',
      dot: '',
      treadDepthMm: 8.0,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseKm: vehicle.currentKm,
      purchasePrice: 8000,
      isCurrentlyInstalled: tires.length === 0,
      storageLocation: 'Araç üzerinde takılı',
      notes: '',
    });
    onOpenAddTireModal();
  };

  const handleOpenEditTire = (tire: TireSet) => {
    setEditingTire(tire);
    setTireFormData({
      season: tire.season,
      brand: tire.brand,
      model: tire.model,
      size: tire.size,
      dot: tire.dot || '',
      treadDepthMm: tire.treadDepthMm || 8.0,
      purchaseDate: tire.purchaseDate || '',
      purchaseKm: tire.purchaseKm || vehicle.currentKm,
      purchasePrice: tire.purchasePrice || 0,
      isCurrentlyInstalled: tire.isCurrentlyInstalled,
      storageLocation: tire.storageLocation || '',
      notes: tire.notes || '',
    });
    onOpenAddTireModal();
  };

  const handleTireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTire: TireSet = {
      id: editingTire ? editingTire.id : `tire-${Date.now()}`,
      vehicleId: vehicle.id,
      season: tireFormData.season,
      brand: tireFormData.brand.trim() || 'Lastik',
      model: tireFormData.model.trim() || '',
      size: tireFormData.size.trim() || 'Standart Ebat',
      dot: tireFormData.dot.trim() || undefined,
      treadDepthMm: Number(tireFormData.treadDepthMm),
      purchaseDate: tireFormData.purchaseDate || undefined,
      purchaseKm: Number(tireFormData.purchaseKm) || undefined,
      purchasePrice: Number(tireFormData.purchasePrice) || 0,
      isCurrentlyInstalled: tireFormData.isCurrentlyInstalled,
      lastMountedDate: tireFormData.isCurrentlyInstalled ? (editingTire?.lastMountedDate || new Date().toISOString().split('T')[0]) : undefined,
      lastMountedKm: tireFormData.isCurrentlyInstalled ? (editingTire?.lastMountedKm || vehicle.currentKm) : undefined,
      totalKmUsed: editingTire ? editingTire.totalKmUsed : 0,
      storageLocation: tireFormData.storageLocation.trim() || undefined,
      notes: tireFormData.notes.trim() || undefined,
      createdAt: editingTire ? editingTire.createdAt : new Date().toISOString(),
    };

    onSaveTire(newTire);
    onCloseAddTireModal();
  };

  // Battery Open Handlers
  const handleOpenNewBattery = () => {
    setEditingBattery(null);
    setBatteryFormData({
      brand: 'Varta',
      model: 'Silver Dynamic',
      capacityAh: 72,
      ccaA: 760,
      technology: 'agm',
      changeDate: new Date().toISOString().split('T')[0],
      changeKm: vehicle.currentKm,
      cost: 4800,
      vendor: '',
      warrantyMonths: 24,
      voltage: 12.6,
      notes: '',
    });
    setIsBatteryModalOpen(true);
  };

  const handleOpenEditBattery = (bat: BatteryRecord) => {
    setEditingBattery(bat);
    setBatteryFormData({
      brand: bat.brand,
      model: bat.model,
      capacityAh: bat.capacityAh,
      ccaA: bat.ccaA,
      technology: bat.technology,
      changeDate: bat.changeDate,
      changeKm: bat.changeKm,
      cost: bat.cost,
      vendor: bat.vendor || '',
      warrantyMonths: bat.warrantyMonths || 24,
      voltage: bat.voltage || 12.6,
      notes: bat.notes || '',
    });
    setIsBatteryModalOpen(true);
  };

  const handleBatterySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date(batteryFormData.changeDate);
    d.setMonth(d.getMonth() + Number(batteryFormData.warrantyMonths));
    const warrantyEndDate = d.toISOString().split('T')[0];

    const newBat: BatteryRecord = {
      id: editingBattery ? editingBattery.id : `bat-${Date.now()}`,
      vehicleId: vehicle.id,
      brand: batteryFormData.brand.trim() || 'Akü',
      model: batteryFormData.model.trim() || '',
      capacityAh: Number(batteryFormData.capacityAh),
      ccaA: Number(batteryFormData.ccaA),
      technology: batteryFormData.technology,
      changeDate: batteryFormData.changeDate,
      changeKm: Number(batteryFormData.changeKm),
      cost: Number(batteryFormData.cost) || 0,
      vendor: batteryFormData.vendor.trim() || undefined,
      warrantyMonths: Number(batteryFormData.warrantyMonths),
      warrantyEndDate,
      isActive: true, // Yeni kaydedilen akü aktif yapılır
      voltage: Number(batteryFormData.voltage) || undefined,
      notes: batteryFormData.notes.trim() || undefined,
      createdAt: editingBattery ? editingBattery.createdAt : new Date().toISOString(),
    };

    onSaveBattery(newBat);
    setIsBatteryModalOpen(false);
  };

  // Diş Derinliği Hızlı Kaydetme
  const handleSaveTreadDepth = (tire: TireSet) => {
    onSaveTire({
      ...tire,
      treadDepthMm: Number(newTreadValue),
    });
    setEditingTreadTireId(null);
  };

  const mountedTire = tires.find(t => t.isCurrentlyInstalled);
  const otherTires = tires.filter(t => !t.isCurrentlyInstalled);
  const activeBattery = batteries.find(b => b.isActive);
  const pastBatteries = batteries.filter(b => !b.isActive);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Üst Sekme Başlığı */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Disc className="w-6 h-6 text-amber-500" />
            <span>Lastik & Akü Yönetimi</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Mevsimsel lastik değişimleri, diş derinliği ve akü ömrü / garanti takibi
          </p>
        </div>

        {/* Alt Sekme Değiştirici */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveSubTab('tires')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'tires'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Disc className="w-4 h-4 text-amber-500" />
            <span>Lastikler ({tires.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('battery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSubTab === 'battery'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BatteryCharging className="w-4 h-4 text-emerald-500" />
            <span>Akü ({batteries.length})</span>
          </button>
        </div>
      </div>

      {/* ======================= LASTİKLER SEKMESİ ======================= */}
      {activeSubTab === 'tires' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Aksiyon Butonu */}
          <div className="flex justify-end">
            <button
              onClick={handleOpenNewTire}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Lastik Seti Ekle</span>
            </button>
          </div>

          {/* 1. Araca Takılı Lastik Seti */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Şu Anda Araçta Takılı Olan Lastik Seti</span>
            </h3>

            {mountedTire ? (
              <div className="bg-gradient-to-br from-white to-amber-50/40 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border-2 border-amber-400/70 dark:border-amber-500/50 p-5 sm:p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                      <Disc className="w-8 h-8" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          mountedTire.season === 'yazlik' 
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                            : mountedTire.season === 'kislik'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                        }`}>
                          {mountedTire.season === 'yazlik' ? '☀️ Yazlık Set' : mountedTire.season === 'kislik' ? '❄️ Kışlık Set (M+S)' : '🌿 4 Mevsim Set'}
                        </span>

                        {mountedTire.dot && (
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold" title="Üretim Tarihi: Hafta/Yıl">
                            DOT: {mountedTire.dot}
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {mountedTire.brand} {mountedTire.model}
                      </h4>
                      <p className="text-xs sm:text-sm font-mono font-medium text-slate-600 dark:text-slate-300">
                        Ebat: {mountedTire.size}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditTire(mountedTire)}
                      className="p-2 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Bu lastik setini silmek istediğinize emin misiniz?')) {
                          onDeleteTire(mountedTire.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Diş Derinliği & Metrikler */}
                <div className="mt-5 pt-4 border-t border-amber-200/50 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Diş Derinliği Göstergesi */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-amber-200/40 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Kalan Diş Derinliği
                      </span>
                      {editingTreadTireId === mountedTire.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="12"
                            value={newTreadValue}
                            onChange={(e) => setNewTreadValue(parseFloat(e.target.value))}
                            className="w-16 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded text-xs text-center font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveTreadDepth(mountedTire)}
                            className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTreadTireId(mountedTire.id);
                            setNewTreadValue(mountedTire.treadDepthMm || 6.0);
                          }}
                          className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium"
                        >
                          Ölçüm Güncelle
                        </button>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {mountedTire.treadDepthMm ? `${mountedTire.treadDepthMm} mm` : '-'}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        (Sıfır lastik: ~8 mm)
                      </span>
                    </div>

                    {/* İlerleme Çubuğu */}
                    {mountedTire.treadDepthMm !== undefined && (
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mt-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            mountedTire.treadDepthMm <= 2.0
                              ? 'bg-rose-500'
                              : mountedTire.treadDepthMm <= 4.0
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, (mountedTire.treadDepthMm / 8.0) * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Kullanım Bilgisi */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-amber-200/40 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Bu Sette Yapılan Yol
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatKm(mountedTire.totalKmUsed || 0)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Son Takılma: {formatDate(mountedTire.lastMountedDate)} ({formatKm(mountedTire.lastMountedKm)})
                    </span>
                  </div>

                  {/* Fiyat ve Satın Alma */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-amber-200/40 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Set Satın Alma Bilgisi
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                        {formatCurrency(mountedTire.purchasePrice)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Satın Alma: {formatDate(mountedTire.purchaseDate)}
                    </span>
                  </div>
                </div>

                {mountedTire.notes && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
                    Not: {mountedTire.notes}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                <Disc className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Şu anda araç üzerinde takılı aktif lastik seti seçilmemiş.
                </p>
              </div>
            )}
          </div>

          {/* 2. Diğer Lastik Setleri / Depodakiler */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span>Depoda / Lastik Otelindeki Diğer Setler ({otherTires.length})</span>
            </h3>

            {otherTires.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                Depoda veya lastikçide bekleyen başka bir set bulunmuyor.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherTires.map((tire) => (
                  <div
                    key={tire.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        tire.season === 'kislik' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {tire.season === 'kislik' ? '❄️ Kışlık Set' : '☀️ Yazlık Set'}
                      </span>

                      <span className="text-xs text-slate-400 font-mono">
                        {tire.size}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {tire.brand} {tire.model}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Saklama Yeri: <strong className="text-slate-700 dark:text-slate-300">{tire.storageLocation || 'Belirtilmedi'}</strong>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Diş Derinliği</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {tire.treadDepthMm ? `${tire.treadDepthMm} mm` : '-'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Toplam Kullanım</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {formatKm(tire.totalKmUsed || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => onMountTire(tire.id, vehicle.currentKm)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Bu Seti Araca Tak</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditTire(tire)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Bu seti silmek istediğinize emin misiniz?')) {
                              onDeleteTire(tire.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
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

        </div>
      )}

      {/* ======================= AKÜ SEKMESİ ======================= */}
      {activeSubTab === 'battery' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          <div className="flex justify-end">
            <button
              onClick={handleOpenNewBattery}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Akü Kaydet</span>
            </button>
          </div>

          {/* 1. Araca Takılı Aktif Akü */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span>Araca Takılı Olan Akü</span>
            </h3>

            {activeBattery ? (
              <div className="bg-gradient-to-br from-white to-emerald-50/40 dark:from-slate-800 dark:to-slate-800/80 rounded-3xl border-2 border-emerald-400/70 dark:border-emerald-500/50 p-5 sm:p-6 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                      <BatteryCharging className="w-8 h-8" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {activeBattery.technology.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono font-bold">
                          {activeBattery.capacityAh} Ah • {activeBattery.ccaA} A (CCA)
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                        {activeBattery.brand} {activeBattery.model}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Değişim Tarihi: <strong>{formatDate(activeBattery.changeDate)}</strong> ({formatKm(activeBattery.changeKm)})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditBattery(activeBattery)}
                      className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Bu akü kaydını silmek istediğinize emin misiniz?')) {
                          onDeleteBattery(activeBattery.id);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Garanti ve Voltaj Metrikleri */}
                <div className="mt-5 pt-4 border-t border-emerald-200/50 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Garanti İlerlemesi */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-emerald-200/40 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Garanti Durumu ({activeBattery.warrantyMonths} Ay)
                    </span>
                    <span className="text-base font-bold text-slate-900 dark:text-white block font-mono">
                      Bitiş: {formatDate(activeBattery.warrantyEndDate)}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {activeBattery.vendor ? `Satıcı: ${activeBattery.vendor}` : 'Resmi Garanti'}
                    </span>
                  </div>

                  {/* Son Voltaj Ölçümü */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-emerald-200/40 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Akü Voltajı & Şarj Sağlığı
                    </span>
                    <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {activeBattery.voltage ? `${activeBattery.voltage} V` : '12.6 V'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      12.6V üstü tam şarj / sağlıklı
                    </span>
                  </div>

                  {/* Maliyet */}
                  <div className="bg-white/80 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-emerald-200/40 dark:border-slate-700">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Akü Fiyatı & Değişim
                    </span>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {formatCurrency(activeBattery.cost)}
                    </span>
                  </div>
                </div>

                {activeBattery.notes && (
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
                    Not: {activeBattery.notes}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
                <BatteryCharging className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Henüz kayıtlı bir akü bulunmuyor.
                </p>
              </div>
            )}
          </div>

          {/* Geçmiş Akü Değişimleri */}
          {pastBatteries.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Geçmiş Akü Kayıtları
              </h3>
              <div className="space-y-3">
                {pastBatteries.map((bat) => (
                  <div
                    key={bat.id}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                        {bat.brand} {bat.model} ({bat.capacityAh} Ah)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Değişim: {formatDate(bat.changeDate)} • {formatKm(bat.changeKm)}
                      </p>
                    </div>
                    <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {formatCurrency(bat.cost)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ======================= LASTİK EKLE / DÜZENLE MODALI ======================= */}
      {isOpenAddTireModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Disc className="w-5 h-5 text-amber-500" />
                <span>{editingTire ? 'Lastik Setini Düzenle' : 'Yeni Lastik Seti Ekle'}</span>
              </h3>
              <button onClick={onCloseAddTireModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTireSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Mevsim *</label>
                  <select
                    value={tireFormData.season}
                    onChange={(e) => setTireFormData(p => ({ ...p, season: e.target.value as TireSeason }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
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
                    value={tireFormData.size}
                    onChange={(e) => setTireFormData(p => ({ ...p, size: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
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
                    value={tireFormData.brand}
                    onChange={(e) => setTireFormData(p => ({ ...p, brand: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="örn: PremiumContact 7"
                    value={tireFormData.model}
                    onChange={(e) => setTireFormData(p => ({ ...p, model: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">DOT (Hafta/Yıl)</label>
                  <input
                    type="text"
                    placeholder="örn: 2422"
                    value={tireFormData.dot}
                    onChange={(e) => setTireFormData(p => ({ ...p, dot: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Diş Derinliği (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={tireFormData.treadDepthMm}
                    onChange={(e) => setTireFormData(p => ({ ...p, treadDepthMm: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Satın Alma Tutarı</label>
                  <input
                    type="number"
                    value={tireFormData.purchasePrice}
                    onChange={(e) => setTireFormData(p => ({ ...p, purchasePrice: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Saklama Yeri / Lastik Oteli</label>
                <input
                  type="text"
                  placeholder="örn: Lastik Park Maslak (Fiş: 1245) veya Garaj"
                  value={tireFormData.storageLocation}
                  onChange={(e) => setTireFormData(p => ({ ...p, storageLocation: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tireFormData.isCurrentlyInstalled}
                    onChange={(e) => setTireFormData(p => ({ ...p, isCurrentlyInstalled: e.target.checked }))}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Bu seti şu anda araçta takılı olarak ayarla
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={onCloseAddTireModal} className="px-4 py-2 text-xs rounded-xl text-slate-600">İptal</button>
                <button type="submit" className="px-5 py-2 text-xs font-medium rounded-xl bg-amber-600 text-white">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= AKÜ EKLE / DÜZENLE MODALI ======================= */}
      {isBatteryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BatteryCharging className="w-5 h-5 text-emerald-500" />
                <span>{editingBattery ? 'Akü Bilgisini Düzenle' : 'Yeni Akü Kaydı'}</span>
              </h3>
              <button onClick={() => setIsBatteryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBatterySubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Akü Markası *</label>
                  <input
                    type="text"
                    required
                    placeholder="örn: Varta, Mutlu, İnci"
                    value={batteryFormData.brand}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, brand: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Akü Modeli</label>
                  <input
                    type="text"
                    placeholder="örn: Silver Dynamic AGM"
                    value={batteryFormData.model}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, model: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Kapasite (Ah) *</label>
                  <input
                    type="number"
                    required
                    value={batteryFormData.capacityAh}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, capacityAh: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Marş Akımı (CCA) *</label>
                  <input
                    type="number"
                    required
                    value={batteryFormData.ccaA}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, ccaA: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Teknoloji</label>
                  <select
                    value={batteryFormData.technology}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, technology: e.target.value as BatteryTechnology }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="agm">AGM (Start-Stop)</option>
                    <option value="efb">EFB (Start-Stop)</option>
                    <option value="kursun_asit">Standart Kurşun-Asit</option>
                    <option value="jel">Jel Akü</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Değişim Tarihi *</label>
                  <input
                    type="date"
                    required
                    value={batteryFormData.changeDate}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, changeDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Değişim KM *</label>
                  <input
                    type="number"
                    required
                    value={batteryFormData.changeKm}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, changeKm: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Akü Fiyatı (₺)</label>
                  <input
                    type="number"
                    value={batteryFormData.cost}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, cost: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Garanti Süresi (Ay)</label>
                  <input
                    type="number"
                    value={batteryFormData.warrantyMonths}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, warrantyMonths: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Voltaj Ölçümü (V)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batteryFormData.voltage}
                    onChange={(e) => setBatteryFormData(p => ({ ...p, voltage: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button type="button" onClick={() => setIsBatteryModalOpen(false)} className="px-4 py-2 text-xs rounded-xl text-slate-600">İptal</button>
                <button type="submit" className="px-5 py-2 text-xs font-medium rounded-xl bg-emerald-600 text-white">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
