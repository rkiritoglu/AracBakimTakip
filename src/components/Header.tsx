import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Gauge, 
  Moon, 
  Sun, 
  ChevronDown, 
  Check, 
  Download, 
  Upload, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatKm } from '../utils/calculations';

interface HeaderProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (id: string) => void;
  onAddNewVehicle: () => void;
  onUpdateKm: (newKm: number) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  vehicles,
  activeVehicle,
  onSelectVehicle,
  onAddNewVehicle,
  onUpdateKm,
  isDark,
  onToggleDark,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isKmModalOpen, setIsKmModalOpen] = useState(false);
  const [newKmInput, setNewKmInput] = useState(activeVehicle?.currentKm?.toString() || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleKmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newKmInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateKm(val);
      setIsKmModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Başlık */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  OtoBakım<span className="text-blue-600 dark:text-blue-400">Pro</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Araç Bakım, Yakıt ve Parça Yönetimi
              </p>
            </div>
          </div>

          {/* Orta Kısım: Araç Seçimi & KM Sayacı */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeVehicle ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 transition-all text-left"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: activeVehicle.color || '#3b82f6' }}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono tracking-wider">
                      {activeVehicle.plate}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline truncate max-w-[120px]">
                      {activeVehicle.brand} {activeVehicle.model}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                </button>

                {/* Araç Seçim Açılır Menüsü */}
                {isDropdownOpen && (
                  <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Kayıtlı Araçlarınız
                    </div>
                    {vehicles.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          onSelectVehicle(v.id);
                          setIsDropdownOpen(false);
                          setNewKmInput(v.currentKm.toString());
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                          v.id === activeVehicle.id ? 'bg-blue-50/70 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: v.color || '#3b82f6' }}
                          />
                          <div>
                            <p className="font-mono font-medium text-xs">{v.plate}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">{v.brand} {v.model}</p>
                          </div>
                        </div>
                        {v.id === activeVehicle.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onAddNewVehicle();
                        }}
                        className="w-full text-left px-3 py-2 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Yeni Araç Ekle
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Hızlı KM Güncelleme Butonu */}
            {activeVehicle && (
              <button
                type="button"
                onClick={() => {
                  setNewKmInput(activeVehicle.currentKm.toString());
                  setIsKmModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition-all group"
                title="Güncel kilometreyi güncellemek için tıklayın"
              >
                <Gauge className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-mono font-semibold">{formatKm(activeVehicle.currentKm)}</span>
              </button>
            )}
          </div>

          {/* Sağ Kısım: Tema Değişimi & Veri Menüsü */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDark}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Açık Mod' : 'Karanlık Mod'}
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Veri Menüsü */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Veri ve Yedekleme Menüsü"
              >
                <Download className="w-5 h-5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onExportData();
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <Download className="w-4 h-4 text-emerald-500" />
                    <span>Yedek İndir (JSON)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onImportData();
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span>Yedekten Geri Yükle</span>
                  </button>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onResetData();
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Örnek Demo Verileri Yükle</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KM Güncelleme Modalı */}
      {isKmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Kilometre Güncelle
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {activeVehicle?.plate} ({activeVehicle?.brand} {activeVehicle?.model})
                </p>
              </div>
            </div>

            <form onSubmit={handleKmSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
                  Yeni Kilometre Değeri
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={activeVehicle?.currentKm || 0}
                    value={newKmInput}
                    onChange={(e) => setNewKmInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="örn: 125000"
                  />
                  <span className="absolute right-3.5 top-3 text-xs font-medium text-slate-400">
                    KM
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Mevcut kayıtlı kilometre: {formatKm(activeVehicle?.currentKm)}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsKmModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                >
                  Kaydet ve Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
