import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Gauge, 
  ChevronDown, 
  Check 
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatKm } from '../utils/calculations';

interface HeaderProps {
  vehicles: Vehicle[];
  activeVehicle: Vehicle | null;
  onSelectVehicle: (id: string) => void;
  onAddNewVehicle: () => void;
  onUpdateKm: (newKm: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  vehicles,
  activeVehicle,
  onSelectVehicle,
  onAddNewVehicle,
  onUpdateKm,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isKmModalOpen, setIsKmModalOpen] = useState(false);
  const [newKmInput, setNewKmInput] = useState(activeVehicle?.currentKm?.toString() || '');

  const handleKmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newKmInput, 10);
    if (!isNaN(val) && val >= 0) {
      onUpdateKm(val);
      setIsKmModalOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Satır: Logo & Başlık */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  OtoBakım<span className="text-blue-600 dark:text-blue-400">Pro</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Araç Bakım, Yakıt ve Parça Yönetimi
              </p>
            </div>
          </div>
        </div>

        {/* 2. Satır: Ekran Genişliğinde Koyu Renk Araç Seçim ve Kilometre Butonları */}
        {activeVehicle && (
          <div className="w-full py-2.5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
              
              {/* Araç Seçim Dropdown */}
              <div className="relative w-full">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full h-11 sm:h-12 flex items-center justify-between px-3 sm:px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 text-white border border-slate-700/80 shadow-md transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: activeVehicle.color || '#3b82f6' }}
                    />
                    <span className="font-bold text-xs sm:text-sm text-white font-mono tracking-wider truncate">
                      {activeVehicle.plate}
                    </span>
                    <span className="text-xs text-slate-400 hidden sm:inline truncate max-w-[130px] md:max-w-[200px]">
                      • {activeVehicle.brand} {activeVehicle.model}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors flex-shrink-0 ml-1" />
                </button>

                {/* Araç Seçim Açılır Menüsü */}
                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full min-w-[250px] max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
                        className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                          v.id === activeVehicle.id ? 'bg-blue-50/70 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: v.color || '#3b82f6' }}
                          />
                          <div className="truncate">
                            <p className="font-mono text-xs font-bold">{v.plate}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{v.brand} {v.model}</p>
                          </div>
                        </div>
                        {v.id === activeVehicle.id && <Check className="w-4 h-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />}
                      </button>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-800 my-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onAddNewVehicle();
                        }}
                        className="w-full text-left px-3.5 py-2 flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Yeni Araç Ekle
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Kilometre Butonu */}
              <button
                type="button"
                onClick={() => {
                  setNewKmInput(activeVehicle.currentKm.toString());
                  setIsKmModalOpen(true);
                }}
                className="w-full h-11 sm:h-12 flex items-center justify-between px-3 sm:px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900 text-white border border-slate-700/80 shadow-md transition-all group cursor-pointer"
                title="Güncel kilometreyi güncellemek için tıklayın"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 flex-shrink-0">
                    <Gauge className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-400 hidden xs:inline">KM:</span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-white tracking-wide truncate">
                    {formatKm(activeVehicle.currentKm)}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 group-hover:text-blue-400 transition-colors hidden sm:inline font-sans">
                  Güncelle ✎
                </span>
              </button>

            </div>
          </div>
        )}

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
                <input
                  type="number"
                  min={0}
                  required
                  value={newKmInput}
                  onChange={(e) => setNewKmInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsKmModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all"
                >
                  Güncelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
