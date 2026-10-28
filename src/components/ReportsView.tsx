import React from 'react';
import { 
  Vehicle, 
  MaintenanceRecord, 
  FuelRecord, 
  TireSet, 
  BatteryRecord 
} from '../types';
import { 
  formatCurrency, 
  formatKm, 
  formatDate, 
  calculateOverallExpenses, 
  calculateFuelStats 
} from '../utils/calculations';
import { 
  BarChart3, 
  Download, 
  Printer, 
  PieChart, 
  Fuel, 
  Wrench, 
  Package, 
  Disc, 
  BatteryCharging, 
  Layers 
} from 'lucide-react';

interface ReportsViewProps {
  vehicle: Vehicle;
  maintenance: MaintenanceRecord[];
  fuel: FuelRecord[];
  tires: TireSet[];
  batteries: BatteryRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  vehicle,
  maintenance,
  fuel,
  tires,
  batteries,
}) => {
  const overall = calculateOverallExpenses(vehicle, maintenance, fuel, tires, batteries);
  const fuelStats = calculateFuelStats(fuel);

  // Kategori yüzdeleri
  const total = overall.totalExpense || 1;
  const fuelPct = ((overall.fuelCost / total) * 100).toFixed(1);
  const partsPct = ((overall.partsCostOnly / total) * 100).toFixed(1);
  const laborPct = ((overall.laborCostOnly / total) * 100).toFixed(1);
  const tiresPct = ((overall.tiresCost / total) * 100).toFixed(1);
  const batteryPct = ((overall.batteryCost / total) * 100).toFixed(1);

  // CSV İndirme İşlevleri
  const exportMaintenanceCSV = () => {
    let csv = '\uFEFFTarih;KM;Bakim Turu;Islem Basligi;Servis;Iscilik;Parcalar Toplami;Genel Toplam;Notlar\n';
    maintenance.forEach(m => {
      const partsTotal = m.parts?.reduce((sum, p) => sum + p.totalPrice, 0) || 0;
      csv += `"${m.date}";"${m.km}";"${m.type}";"${m.title}";"${m.serviceName}";"${m.laborCost}";"${partsTotal}";"${m.totalCost}";"${(m.notes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vehicle.plate}_Bakim_ve_Parca_Gecmisi.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportFuelCSV = () => {
    let csv = '\uFEFFTarih;KM;Litre;Birim Fiyat;Toplam Tutar;Tam Depo;L/100km;Istasyon;Notlar\n';
    fuel.forEach(f => {
      csv += `"${f.date}";"${f.km}";"${f.liters}";"${f.pricePerLiter}";"${f.totalCost}";"${f.isFullTank ? 'Evet' : 'Hayir'}";"${f.consumptionL100 || ''}";"${f.station || ''}";"${(f.notes || '').replace(/"/g, '""')}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${vehicle.plate}_Yakit_Gecmisi.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Üst Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
            <span>Maliyet Raporları & Analizler</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Toplam araç maliyeti, kategori dağılımı ve CSV veri çıktısı
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Yazdır / PDF</span>
          </button>

          <button
            onClick={exportMaintenanceCSV}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Bakım CSV İndir</span>
          </button>

          <button
            onClick={exportFuelCSV}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Yakıt CSV İndir</span>
          </button>
        </div>
      </div>

      {/* Toplam Mülkiyet Maliyeti (TCO) Kartı */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Toplam Araç Masrafı (TCO)
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1 text-white">
              {formatCurrency(overall.totalExpense)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Yakıt, bakım, yedek parça, lastik ve akü dahil
            </p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              KM Başına Toplam Maliyet
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1 text-indigo-400">
              {overall.costPerKm} ₺
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Toplam Masraf / Güncel KM ({formatKm(vehicle.currentKm)})
            </p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
              Ortalama Yakıt Tüketimi
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono mt-1 text-blue-400">
              {fuelStats.avgConsumptionL100 > 0 ? `${fuelStats.avgConsumptionL100} L` : '-'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              100 Kilometre Başına (KM Başı: {fuelStats.avgCostPerKm} ₺)
            </p>
          </div>
        </div>
      </div>

      {/* Masraf Kategorileri Dağılımı */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-500" />
          <span>Harcama Kategorileri ve Yüzdeleri</span>
        </h3>

        {/* Çok Renkli Çubuk */}
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700 shadow-inner">
          <div style={{ width: `${fuelPct}%` }} className="bg-blue-500 h-full transition-all" title={`Yakıt: %${fuelPct}`} />
          <div style={{ width: `${partsPct}%` }} className="bg-indigo-500 h-full transition-all" title={`Parçalar: %${partsPct}`} />
          <div style={{ width: `${laborPct}%` }} className="bg-purple-500 h-full transition-all" title={`İşçilik: %${laborPct}`} />
          <div style={{ width: `${tiresPct}%` }} className="bg-amber-500 h-full transition-all" title={`Lastik: %${tiresPct}`} />
          <div style={{ width: `${batteryPct}%` }} className="bg-emerald-500 h-full transition-all" title={`Akü: %${batteryPct}`} />
        </div>

        {/* Kategori Detay Kutuları */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <Fuel className="w-4 h-4" />
              <span>Yakıt ({fuelPct}%)</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatCurrency(overall.fuelCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <Package className="w-4 h-4" />
              <span>Parçalar ({partsPct}%)</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatCurrency(overall.partsCostOnly)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-semibold">
              <Wrench className="w-4 h-4" />
              <span>İşçilik ({laborPct}%)</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatCurrency(overall.laborCostOnly)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <Disc className="w-4 h-4" />
              <span>Lastikler ({tiresPct}%)</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatCurrency(overall.tiresCost)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <BatteryCharging className="w-4 h-4" />
              <span>Akü ({batteryPct}%)</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
              {formatCurrency(overall.batteryCost)}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
