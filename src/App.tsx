import React, { useState, useEffect, useRef } from 'react';
import { StorageService } from './services/storage';
import { 
  Vehicle, 
  MaintenanceRecord, 
  FuelRecord, 
  TireSet, 
  BatteryRecord, 
  MaintenanceScheduleItem 
} from './types';
import { generateReminders, calculateFuelStats } from './utils/calculations';
import { Header } from './components/Header';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { DashboardView } from './components/DashboardView';
import { MaintenanceView } from './components/MaintenanceView';
import { FuelView } from './components/FuelView';
import { TiresAndBatteryView } from './components/TiresAndBatteryView';
import { ScheduleView } from './components/ScheduleView';
import { ReportsView } from './components/ReportsView';
import { VehicleSettingsView } from './components/VehicleSettingsView';
import { AddFuelModal } from './components/modals/AddFuelModal';
import { AddMaintenanceModal } from './components/modals/AddMaintenanceModal';
import { AddTireModal } from './components/modals/AddTireModal';
import { AddScheduleModal } from './components/modals/AddScheduleModal';
import { Car, Plus, Sparkles } from 'lucide-react';

export function App() {
  // Tema Kontrolü
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Database State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);
  const [fuel, setFuel] = useState<FuelRecord[]>([]);
  const [tires, setTires] = useState<TireSet[]>([]);
  const [batteries, setBatteries] = useState<BatteryRecord[]>([]);
  const [schedules, setSchedules] = useState<MaintenanceScheduleItem[]>([]);

  // Modal Tetikleyicileri & Düzenleme Durumları
  const [isOpenAddMaintenance, setIsOpenAddMaintenance] = useState(false);
  const [editingMaintenanceRecord, setEditingMaintenanceRecord] = useState<MaintenanceRecord | null>(null);

  const [isOpenAddFuel, setIsOpenAddFuel] = useState(false);
  const [editingFuelRecord, setEditingFuelRecord] = useState<FuelRecord | null>(null);

  const [isOpenAddTire, setIsOpenAddTire] = useState(false);
  const [editingTireRecord, setEditingTireRecord] = useState<TireSet | null>(null);

  const [isOpenAddSchedule, setIsOpenAddSchedule] = useState(false);
  const [editingScheduleRecord, setEditingScheduleRecord] = useState<MaintenanceScheduleItem | null>(null);

  // Dosya Yükleme Referansı
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verileri Yükle
  const refreshData = () => {
    StorageService.initSampleDataIfEmpty();
    const vList = StorageService.getVehicles();
    setVehicles(vList);

    const activeId = StorageService.getActiveVehicleId();
    setActiveVehicleId(activeId);

    if (activeId) {
      setMaintenance(StorageService.getMaintenanceRecords(activeId));
      setFuel(StorageService.getFuelRecords(activeId));
      setTires(StorageService.getTireSets(activeId));
      setBatteries(StorageService.getBatteryRecords(activeId));
      setSchedules(StorageService.getScheduleItems(activeId));
    } else {
      setMaintenance([]);
      setFuel([]);
      setTires([]);
      setBatteries([]);
      setSchedules([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Aktif Araç Değiştiğinde
  const handleSelectVehicle = (id: string) => {
    StorageService.setActiveVehicleId(id);
    setActiveVehicleId(id);
    setMaintenance(StorageService.getMaintenanceRecords(id));
    setFuel(StorageService.getFuelRecords(id));
    setTires(StorageService.getTireSets(id));
    setBatteries(StorageService.getBatteryRecords(id));
    setSchedules(StorageService.getScheduleItems(id));
  };

  // Kilometre Güncelleme
  const handleUpdateKm = (newKm: number) => {
    if (!activeVehicleId) return;
    StorageService.updateVehicleKm(activeVehicleId, newKm);
    refreshData();
  };

  // Bakım Kaydı Kaydetme
  const handleSaveMaintenance = (record: MaintenanceRecord) => {
    StorageService.saveMaintenanceRecord(record);
    refreshData();
  };

  const handleDeleteMaintenance = (id: string) => {
    StorageService.deleteMaintenanceRecord(id);
    refreshData();
  };

  // Yakıt Kaydı Kaydetme
  const handleSaveFuel = (record: FuelRecord) => {
    StorageService.saveFuelRecord(record);
    refreshData();
  };

  const handleDeleteFuel = (id: string) => {
    StorageService.deleteFuelRecord(id);
    refreshData();
  };

  // Lastik İşlemleri
  const handleSaveTire = (tire: TireSet) => {
    StorageService.saveTireSet(tire);
    refreshData();
  };

  const handleDeleteTire = (id: string) => {
    StorageService.deleteTireSet(id);
    refreshData();
  };

  const handleMountTire = (tireId: string, currentKm: number) => {
    StorageService.setTireMounted(tireId, currentKm);
    refreshData();
  };

  // Akü İşlemleri
  const handleSaveBattery = (battery: BatteryRecord) => {
    StorageService.saveBatteryRecord(battery);
    refreshData();
  };

  const handleDeleteBattery = (id: string) => {
    StorageService.deleteBatteryRecord(id);
    refreshData();
  };

  // Bakım Planı İşlemleri
  const handleSaveSchedule = (item: MaintenanceScheduleItem) => {
    StorageService.saveScheduleItem(item);
    refreshData();
  };

  const handleDeleteSchedule = (id: string) => {
    StorageService.deleteScheduleItem(id);
    refreshData();
  };

  const handleResetTemplates = () => {
    if (!activeVehicleId || !activeVehicle) return;
    StorageService.createDefaultSchedulesForVehicle(activeVehicleId, activeVehicle.currentKm);
    refreshData();
  };

  // Araç İşlemleri
  const handleSaveVehicle = (vehicle: Vehicle) => {
    StorageService.saveVehicle(vehicle);
    StorageService.setActiveVehicleId(vehicle.id);
    // Eğer yeni araçsa varsayılan takvimi ekle
    StorageService.createDefaultSchedulesForVehicle(vehicle.id, vehicle.currentKm);
    refreshData();
  };

  const handleDeleteVehicle = (id: string) => {
    StorageService.deleteVehicle(id);
    refreshData();
  };

  // Dışa / İçe Aktarma
  const handleExportData = () => {
    const jsonStr = StorageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OtoBakim_Yedek_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = StorageService.importAllData(content);
        if (success) {
          alert('Verileriniz başarıyla geri yüklendi!');
          refreshData();
        } else {
          alert('Geçersiz dosya formatı. Lütfen geçerli bir yedek JSON dosyası seçiniz.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('Tüm mevcut kayıtlar silinip örnek demo verileri yüklenecektir. Onaylıyor musunuz?')) {
      StorageService.resetToSampleData();
      refreshData();
    }
  };

  // Aktif Araç ve Hatırlatıcılar
  const activeVehicle = 
    vehicles.find(v => v.id === activeVehicleId) || 
    (vehicles.length > 0 ? vehicles[0] : null);

  const reminders = activeVehicle 
    ? generateReminders(activeVehicle, schedules, tires, batteries.find(b => b.isActive) || null)
    : [];
  const urgentRemindersCount = reminders.filter(r => r.type === 'danger' || r.type === 'warning').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Gizli Dosya Girişi */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />

      {/* Header */}
      <Header
        vehicles={vehicles}
        activeVehicle={activeVehicle}
        onSelectVehicle={handleSelectVehicle}
        onAddNewVehicle={() => setActiveTab('vehicle')}
        onUpdateKm={handleUpdateKm}
        isDark={isDark}
        onToggleDark={toggleDark}
        onExportData={handleExportData}
        onImportData={handleImportClick}
        onResetData={handleResetData}
      />

      {/* Navigasyon Tabları */}
      {activeVehicle && (
        <NavigationTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          urgentCount={urgentRemindersCount}
        />
      )}

      {/* Ana İçerik */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {vehicles.length === 0 ? (
          activeTab === 'vehicle' ? (
            <VehicleSettingsView
              vehicles={vehicles}
              activeVehicle={null}
              onSelectVehicle={handleSelectVehicle}
              onSaveVehicle={handleSaveVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onExportData={handleExportData}
              onImportData={handleImportClick}
              onResetData={handleResetData}
            />
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm max-w-md mx-auto my-12">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Kayıtlı Araç Bulunamadı
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Araç bakım, yakıt ve parça kayıtlarınızı tutmaya başlamak için yeni bir araç ekleyin veya örnek verileri yükleyin.
              </p>
              <div className="mt-6 flex flex-col gap-2.5">
                <button
                  onClick={() => setActiveTab('vehicle')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Araç Ekle</span>
                </button>
                <button
                  onClick={handleResetData}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Örnek Demo Araç ve Verilerini Yükle</span>
                </button>
              </div>
            </div>
          )
        ) : !activeVehicle ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500">Lütfen yukarıdaki menüden bir araç seçiniz.</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                vehicle={activeVehicle}
                maintenance={maintenance}
                fuel={fuel}
                tires={tires}
                batteries={batteries}
                schedules={schedules}
                reminders={reminders}
                onChangeTab={setActiveTab}
                onOpenAddFuel={() => {
                  setEditingFuelRecord(null);
                  setIsOpenAddFuel(true);
                }}
                onOpenAddMaintenance={() => {
                  setEditingMaintenanceRecord(null);
                  setIsOpenAddMaintenance(true);
                }}
                onOpenAddTire={() => {
                  setEditingTireRecord(null);
                  setIsOpenAddTire(true);
                }}
                onOpenAddSchedule={() => {
                  setEditingScheduleRecord(null);
                  setIsOpenAddSchedule(true);
                }}
                onQuickUpdateKm={() => {
                  const val = prompt('Yeni Kilometre Giriniz:', activeVehicle.currentKm.toString());
                  if (val && !isNaN(parseInt(val, 10))) {
                    handleUpdateKm(parseInt(val, 10));
                  }
                }}
              />
            )}

            {activeTab === 'maintenance' && (
              <MaintenanceView
                vehicle={activeVehicle}
                records={maintenance}
                onOpenAddModal={() => {
                  setEditingMaintenanceRecord(null);
                  setIsOpenAddMaintenance(true);
                }}
                onEditRecord={(rec) => {
                  setEditingMaintenanceRecord(rec);
                  setIsOpenAddMaintenance(true);
                }}
                onDeleteRecord={handleDeleteMaintenance}
              />
            )}

            {activeTab === 'fuel' && (
              <FuelView
                vehicle={activeVehicle}
                records={fuel}
                onOpenAddModal={() => {
                  setEditingFuelRecord(null);
                  setIsOpenAddFuel(true);
                }}
                onEditRecord={(rec) => {
                  setEditingFuelRecord(rec);
                  setIsOpenAddFuel(true);
                }}
                onDeleteRecord={handleDeleteFuel}
              />
            )}

            {activeTab === 'tires-battery' && (
              <TiresAndBatteryView
                vehicle={activeVehicle}
                tires={tires}
                batteries={batteries}
                onOpenAddTireModal={() => {
                  setEditingTireRecord(null);
                  setIsOpenAddTire(true);
                }}
                onEditTire={(tire) => {
                  setEditingTireRecord(tire);
                  setIsOpenAddTire(true);
                }}
                onSaveTire={handleSaveTire}
                onDeleteTire={handleDeleteTire}
                onMountTire={handleMountTire}
                onSaveBattery={handleSaveBattery}
                onDeleteBattery={handleDeleteBattery}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleView
                vehicle={activeVehicle}
                schedules={schedules}
                onSaveSchedule={handleSaveSchedule}
                onDeleteSchedule={handleDeleteSchedule}
                onResetTemplates={handleResetTemplates}
                onOpenAddModal={() => {
                  setEditingScheduleRecord(null);
                  setIsOpenAddSchedule(true);
                }}
                onEditItem={(item) => {
                  setEditingScheduleRecord(item);
                  setIsOpenAddSchedule(true);
                }}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                vehicle={activeVehicle}
                maintenance={maintenance}
                fuel={fuel}
                tires={tires}
                batteries={batteries}
              />
            )}

            {activeTab === 'vehicle' && (
              <VehicleSettingsView
                vehicles={vehicles}
                activeVehicle={activeVehicle}
                onSelectVehicle={handleSelectVehicle}
                onSaveVehicle={handleSaveVehicle}
                onDeleteVehicle={handleDeleteVehicle}
                onExportData={handleExportData}
                onImportData={handleImportClick}
                onResetData={handleResetData}
              />
            )}
          </>
        )}
      </main>

      {/* GLOBAL MODALLER (Genel Bakış Dahil Her Yerden Açılabilir) */}
      {activeVehicle && (
        <>
          <AddFuelModal
            isOpen={isOpenAddFuel}
            vehicle={activeVehicle}
            lastPrice={calculateFuelStats(fuel).lastPricePerLiter}
            editingRecord={editingFuelRecord}
            onSave={(rec) => {
              handleSaveFuel(rec);
              setIsOpenAddFuel(false);
              setEditingFuelRecord(null);
            }}
            onClose={() => {
              setIsOpenAddFuel(false);
              setEditingFuelRecord(null);
            }}
          />

          <AddMaintenanceModal
            isOpen={isOpenAddMaintenance}
            vehicle={activeVehicle}
            editingRecord={editingMaintenanceRecord}
            onSave={(rec) => {
              handleSaveMaintenance(rec);
              setIsOpenAddMaintenance(false);
              setEditingMaintenanceRecord(null);
            }}
            onClose={() => {
              setIsOpenAddMaintenance(false);
              setEditingMaintenanceRecord(null);
            }}
          />

          <AddTireModal
            isOpen={isOpenAddTire}
            vehicle={activeVehicle}
            isFirstTire={tires.length === 0}
            editingTire={editingTireRecord}
            onSave={(tire) => {
              handleSaveTire(tire);
              setIsOpenAddTire(false);
              setEditingTireRecord(null);
            }}
            onClose={() => {
              setIsOpenAddTire(false);
              setEditingTireRecord(null);
            }}
          />

          <AddScheduleModal
            isOpen={isOpenAddSchedule}
            vehicle={activeVehicle}
            editingItem={editingScheduleRecord}
            onSave={(item) => {
              handleSaveSchedule(item);
              setIsOpenAddSchedule(false);
              setEditingScheduleRecord(null);
            }}
            onClose={() => {
              setIsOpenAddSchedule(false);
              setEditingScheduleRecord(null);
            }}
          />
        </>
      )}

    </div>
  );
}
export default App;
