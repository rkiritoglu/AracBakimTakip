import { 
  Vehicle, 
  MaintenanceRecord, 
  FuelRecord, 
  TireSet, 
  BatteryRecord, 
  MaintenanceScheduleItem 
} from '../types';

const STORAGE_KEYS = {
  VEHICLES: 'arac_bakim_vehicles_v1',
  ACTIVE_VEHICLE_ID: 'arac_bakim_active_vehicle_id_v1',
  MAINTENANCE: 'arac_bakim_maintenance_v1',
  FUEL: 'arac_bakim_fuel_v1',
  TIRES: 'arac_bakim_tires_v1',
  BATTERIES: 'arac_bakim_batteries_v1',
  SCHEDULE: 'arac_bakim_schedule_v1',
};

// Varsayılan standart bakım periyot şablonları
export const DEFAULT_SCHEDULE_TEMPLATES = [
  {
    title: 'Motor Yağı ve Yağ Filtresi',
    category: 'sivi' as const,
    intervalKm: 10000,
    intervalMonths: 12,
    notes: 'Üretici onaylı motor yağı ve orijinal yağ filtresi değişimi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Hava Filtresi Değişimi',
    category: 'parca' as const,
    intervalKm: 10000,
    intervalMonths: 12,
    notes: 'Motor hava emiş filtresi değişimi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Polen / Kabin Filtresi (Karbonlu)',
    category: 'parca' as const,
    intervalKm: 10000,
    intervalMonths: 12,
    notes: 'Klima ve havalandırma kabin filtresi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Yakıt Filtresi (Dizel / Benzin)',
    category: 'parca' as const,
    intervalKm: 20000,
    intervalMonths: 24,
    notes: 'Enjektör ve yakıt pompası sağlığı için yakıt filtresi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Fren Hidrolik Sıvısı (DOT 4)',
    category: 'sivi' as const,
    intervalKm: 40000,
    intervalMonths: 24,
    notes: 'Nem tutma sebebiyle 2 yılda bir kaynama noktası kontrolü ve değişimi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Ön ve Arka Fren Balataları',
    category: 'parca' as const,
    intervalKm: 30000,
    intervalMonths: 24,
    notes: 'Fren diskleri ve balata kalınlık kontrolü / değişimi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Bujiler / Isıtma Bujileri',
    category: 'parca' as const,
    intervalKm: 30000,
    intervalMonths: 36,
    notes: 'Ateşleme verimi ve yakıt tasarrufu için buji değişimi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Triger Kayışı / Seti ve Devirdaim',
    category: 'agir' as const,
    intervalKm: 80000,
    intervalMonths: 60,
    notes: 'Triger kayışı, gergi bilyaları ve su pompası kontrol / değişimi.',
    isDefaultTemplate: true,
  },
  {
    title: 'V-Kayışı ve Gergi Rulmanı',
    category: 'parca' as const,
    intervalKm: 60000,
    intervalMonths: 48,
    notes: 'Alternatör ve klima yardımcı kayışı.',
    isDefaultTemplate: true,
  },
  {
    title: 'Şanzıman Yağı Kontrol & Değişim',
    category: 'sivi' as const,
    intervalKm: 60000,
    intervalMonths: 48,
    notes: 'Otomatik veya manuel şanzıman yağı ve filtre yenilemesi.',
    isDefaultTemplate: true,
  },
  {
    title: 'TÜVTÜRK Araç Muayenesi',
    category: 'yasal' as const,
    intervalMonths: 24,
    notes: 'Periyodik zorunlu fenni araç muayenesi.',
    isDefaultTemplate: true,
  },
  {
    title: 'Zorunlu Trafik Sigortası',
    category: 'yasal' as const,
    intervalMonths: 12,
    notes: 'Yıllık yenilenen zorunlu karayolu mali sorumluluk sigortası.',
    isDefaultTemplate: true,
  },
  {
    title: 'Kasko Sigortası',
    category: 'yasal' as const,
    intervalMonths: 12,
    notes: 'Genişletilmiş araç kasko poliçesi yenilemesi.',
    isDefaultTemplate: true,
  },
];

// Örnek başlangıç verileri
export const SAMPLE_DATA = {
  vehicles: [
    {
      id: 'veh-1',
      plate: '34 AB 789',
      brand: 'Volkswagen',
      model: 'Golf',
      subModel: '1.6 TDI Highline DSG',
      year: 2019,
      fuelType: 'dizel' as const,
      transmission: 'otomatik' as const,
      currentKm: 124500,
      engineCapacity: '1598 cc',
      enginePower: '115 HP',
      vin: 'WVWZZZAUZKP123456',
      engineNo: 'DGCA89412',
      engineOilSpec: '5W-30 VW 504.00 / 507.00',
      oilCapacityLiters: 4.6,
      inspectionDate: '2027-04-15',
      insuranceDate: '2027-02-10',
      cascoDate: '2027-02-10',
      color: '#2563eb',
      notes: 'Yetkili servis bakımlı, DSG mekatronik yağı 90.000 kmde yenilendi.',
      createdAt: '2026-01-10T10:00:00.000Z',
      updatedAt: '2026-10-25T14:30:00.000Z',
    },
    {
      id: 'veh-2',
      plate: '06 TR 456',
      brand: 'Toyota',
      model: 'Corolla',
      subModel: '1.8 Hybrid Dream e-CVT',
      year: 2021,
      fuelType: 'hibrit' as const,
      transmission: 'otomatik' as const,
      currentKm: 58200,
      engineCapacity: '1798 cc',
      enginePower: '122 HP',
      vin: 'NMTBZ3BE40R045892',
      engineOilSpec: '0W-16 / 0W-20 API SP',
      oilCapacityLiters: 4.2,
      inspectionDate: '2026-12-05',
      insuranceDate: '2026-11-20',
      cascoDate: '2026-11-20',
      color: '#059669',
      notes: 'Batarya garanti uzatması yapıldı. Hibrit sağlık raporu iyi.',
      createdAt: '2026-03-15T09:00:00.000Z',
      updatedAt: '2026-10-20T11:15:00.000Z',
    }
  ],
  maintenance: [
    {
      id: 'maint-1',
      vehicleId: 'veh-1',
      date: '2026-09-12',
      km: 120100,
      type: 'periyodik' as const,
      title: '120.000 KM Periyodik Bakımı',
      serviceName: 'VagTech Özel Servis',
      serviceLocation: 'Maslak Oto Sanayi, İstanbul',
      laborCost: 1500,
      parts: [
        {
          id: 'part-1',
          name: 'Castrol Edge 5W-30 LL Motor Yağı (5L)',
          brand: 'Castrol',
          partNumber: 'EDGE-5W30-5L',
          quantity: 1,
          unitPrice: 1850,
          totalPrice: 1850,
        },
        {
          id: 'part-2',
          name: 'Yağ Filtresi (Orijinal MANN)',
          brand: 'Mann Filter',
          partNumber: 'HU 7020 z',
          quantity: 1,
          unitPrice: 380,
          totalPrice: 380,
        },
        {
          id: 'part-3',
          name: 'Hava Filtresi',
          brand: 'Mann Filter',
          partNumber: 'C 30 005',
          quantity: 1,
          unitPrice: 420,
          totalPrice: 420,
        },
        {
          id: 'part-4',
          name: 'Karbonlu Polen Filtresi',
          brand: 'Mann Filter',
          partNumber: 'FP 26 009',
          quantity: 1,
          unitPrice: 550,
          totalPrice: 550,
        },
        {
          id: 'part-5',
          name: 'Mazot Filtresi',
          brand: 'Bosch',
          partNumber: 'F 026 402 830',
          quantity: 1,
          unitPrice: 720,
          totalPrice: 720,
        },
      ],
      totalCost: 5420,
      notes: 'Karter tapası ve pulu yenilendi. Ön takım ve fren balataları kontrol edildi, balatalar %65 seviyesinde.',
      invoiceNumber: 'FTR-2026-8941',
      nextMaintenanceKm: 130100,
      nextMaintenanceDate: '2027-09-12',
      createdAt: '2026-09-12T16:00:00.000Z',
    },
    {
      id: 'maint-2',
      vehicleId: 'veh-1',
      date: '2026-04-18',
      km: 112000,
      type: 'onarım' as const,
      title: 'Ön Fren Balata & Disk Değişimi',
      serviceName: 'Brembo Fren Merkezi',
      serviceLocation: 'Bostancı Sanayi, İstanbul',
      laborCost: 1200,
      parts: [
        {
          id: 'part-6',
          name: 'Ön Fren Balatası Takımı',
          brand: 'Ferodo',
          partNumber: 'FDB4433',
          quantity: 1,
          unitPrice: 1650,
          totalPrice: 1650,
        },
        {
          id: 'part-7',
          name: 'Ön Fren Diskleri (Çift)',
          brand: 'TRW',
          partNumber: 'DF6108S',
          quantity: 1,
          unitPrice: 3400,
          totalPrice: 3400,
        },
        {
          id: 'part-8',
          name: 'DOT 4 Fren Hidroliği (1L)',
          brand: 'Motul',
          partNumber: 'DOT4-LV',
          quantity: 1,
          unitPrice: 380,
          totalPrice: 380,
        }
      ],
      totalCost: 6630,
      notes: 'Fren hidroliği komple vakumla yenilendi.',
      invoiceNumber: 'BRM-4412',
      createdAt: '2026-04-18T14:20:00.000Z',
    }
  ],
  fuel: [
    {
      id: 'fuel-1',
      vehicleId: 'veh-1',
      date: '2026-10-22',
      km: 124500,
      liters: 45.2,
      pricePerLiter: 44.15,
      totalCost: 1995.58,
      isFullTank: true,
      station: 'Opet - Ataşehir',
      fuelType: 'dizel' as const,
      consumptionL100: 5.32,
      costPerKm: 2.35,
      notes: 'Uzun yol ve şehir içi karma kullanım.',
      createdAt: '2026-10-22T19:30:00.000Z',
    },
    {
      id: 'fuel-2',
      vehicleId: 'veh-1',
      date: '2026-10-08',
      km: 123650,
      liters: 46.0,
      pricePerLiter: 43.80,
      totalCost: 2014.80,
      isFullTank: true,
      station: 'Shell - Ümraniye',
      fuelType: 'dizel' as const,
      consumptionL100: 5.48,
      costPerKm: 2.40,
      notes: 'Shell V-Power Diesel.',
      createdAt: '2026-10-08T18:15:00.000Z',
    },
    {
      id: 'fuel-3',
      vehicleId: 'veh-1',
      date: '2026-09-24',
      km: 122810,
      liters: 44.5,
      pricePerLiter: 43.60,
      totalCost: 1940.20,
      isFullTank: true,
      station: 'Opet - Kadıköy',
      fuelType: 'dizel' as const,
      consumptionL100: 5.25,
      costPerKm: 2.29,
      notes: 'Ultra Force Diesel.',
      createdAt: '2026-09-24T17:45:00.000Z',
    }
  ],
  tires: [
    {
      id: 'tire-1',
      vehicleId: 'veh-1',
      season: 'yazlik' as const,
      brand: 'Continental',
      model: 'PremiumContact 7',
      size: '205/55 R16 91V',
      dot: '1823',
      treadDepthMm: 6.2,
      purchaseDate: '2023-05-10',
      purchaseKm: 98000,
      purchasePrice: 9600,
      isCurrentlyInstalled: true,
      lastMountedDate: '2026-04-05',
      lastMountedKm: 111500,
      totalKmUsed: 21500,
      storageLocation: 'Araç üzerinde takılı',
      notes: 'Yol tutuşu mükemmel, balansı Nisan ayında yapıldı.',
      createdAt: '2023-05-10T12:00:00.000Z',
    },
    {
      id: 'tire-2',
      vehicleId: 'veh-1',
      season: 'kislik' as const,
      brand: 'Michelin',
      model: 'Alpin 6',
      size: '205/55 R16 91H M+S 3PMSF',
      dot: '4022',
      treadDepthMm: 7.1,
      purchaseDate: '2022-11-15',
      purchaseKm: 92000,
      purchasePrice: 8400,
      isCurrentlyInstalled: false,
      lastMountedDate: '2025-11-20',
      lastMountedKm: 104000,
      totalKmUsed: 14500,
      storageLocation: 'Lastik Park Oteli (Fiş no: LP-8821)',
      notes: 'Kasım ayında kışlık değişimi için randevu alınacak.',
      createdAt: '2022-11-15T10:00:00.000Z',
    }
  ],
  batteries: [
    {
      id: 'bat-1',
      vehicleId: 'veh-1',
      brand: 'Varta',
      model: 'Silver Dynamic AGM 570 901 076',
      capacityAh: 70,
      ccaA: 760,
      technology: 'agm' as const,
      changeDate: '2025-01-20',
      changeKm: 106000,
      cost: 4850,
      vendor: 'Mutlu Akü & Varta Yetkili Bayi',
      warrantyMonths: 24,
      warrantyEndDate: '2027-01-20',
      isActive: true,
      voltage: 12.7,
      notes: 'Start-Stop uyumlu AGM akü. Kodlaması yapıldı, şarj dinamosu şarj gerilimi 14.3V ölçüldü.',
      createdAt: '2025-01-20T11:00:00.000Z',
    }
  ],
  schedules: [
    {
      id: 'sch-1',
      vehicleId: 'veh-1',
      title: 'Motor Yağı ve Yağ Filtresi',
      category: 'sivi' as const,
      intervalKm: 10000,
      intervalMonths: 12,
      lastDoneKm: 120100,
      lastDoneDate: '2026-09-12',
      targetKm: 130100,
      targetDate: '2027-09-12',
      notes: 'Castrol Edge 5W-30 LL + Mann Filtre',
      isDefaultTemplate: true,
    },
    {
      id: 'sch-2',
      vehicleId: 'veh-1',
      title: 'Hava ve Polen Filtresi',
      category: 'parca' as const,
      intervalKm: 10000,
      intervalMonths: 12,
      lastDoneKm: 120100,
      lastDoneDate: '2026-09-12',
      targetKm: 130100,
      targetDate: '2027-09-12',
      notes: 'Mann filtre seti',
      isDefaultTemplate: true,
    },
    {
      id: 'sch-3',
      vehicleId: 'veh-1',
      title: 'Triger Kayışı ve Devirdaim Seti',
      category: 'agir' as const,
      intervalKm: 80000,
      intervalMonths: 60,
      lastDoneKm: 90000,
      lastDoneDate: '2023-01-15',
      targetKm: 170000,
      targetDate: '2028-01-15',
      notes: 'Continental Contitech Triger Seti takılmıştı.',
      isDefaultTemplate: true,
    },
    {
      id: 'sch-4',
      vehicleId: 'veh-1',
      title: 'TÜVTÜRK Araç Muayenesi',
      category: 'yasal' as const,
      intervalMonths: 24,
      lastDoneDate: '2025-04-15',
      targetDate: '2027-04-15',
      notes: 'Randevu 1 ay önceden e-Devletten alınabilir.',
      isDefaultTemplate: true,
    },
    {
      id: 'sch-5',
      vehicleId: 'veh-1',
      title: 'Kışlık Lastik Değişimi',
      category: 'lastik' as const,
      intervalMonths: 12,
      targetDate: '2026-11-15',
      notes: 'Ticari ve güvenli sürüş için 1 Aralık zorunluluğundan önce takılmalı.',
      isDefaultTemplate: false,
    }
  ]
};

// Storage helper class
export class StorageService {
  private static load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch (e) {
      console.error(`Error loading key ${key}:`, e);
      return fallback;
    }
  }

  private static save<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key}:`, e);
    }
  }

  // Başlangıç kontrolü - ilk kez açılıyorsa veya boşsa örnek verileri yükle
  public static initSampleDataIfEmpty(): void {
    const existingVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    const parsedVehicles = this.getVehicles();
    if (!existingVehicles || parsedVehicles.length === 0) {
      this.save(STORAGE_KEYS.VEHICLES, SAMPLE_DATA.vehicles);
      this.setActiveVehicleId(SAMPLE_DATA.vehicles[0].id);
      this.save(STORAGE_KEYS.MAINTENANCE, SAMPLE_DATA.maintenance);
      this.save(STORAGE_KEYS.FUEL, SAMPLE_DATA.fuel);
      this.save(STORAGE_KEYS.TIRES, SAMPLE_DATA.tires);
      this.save(STORAGE_KEYS.BATTERIES, SAMPLE_DATA.batteries);
      this.save(STORAGE_KEYS.SCHEDULE, SAMPLE_DATA.schedules);
    } else {
      // Eğer aktif araç id'si yoksa veya listede yoksa ilk aracı aktif yap
      const currentActive = this.getActiveVehicleId();
      if (!currentActive || !parsedVehicles.some(v => v.id === currentActive)) {
        this.setActiveVehicleId(parsedVehicles[0].id);
      }
    }
  }

  public static resetToSampleData(): void {
    this.save(STORAGE_KEYS.VEHICLES, SAMPLE_DATA.vehicles);
    this.setActiveVehicleId(SAMPLE_DATA.vehicles[0].id);
    this.save(STORAGE_KEYS.MAINTENANCE, SAMPLE_DATA.maintenance);
    this.save(STORAGE_KEYS.FUEL, SAMPLE_DATA.fuel);
    this.save(STORAGE_KEYS.TIRES, SAMPLE_DATA.tires);
    this.save(STORAGE_KEYS.BATTERIES, SAMPLE_DATA.batteries);
    this.save(STORAGE_KEYS.SCHEDULE, SAMPLE_DATA.schedules);
  }

  // Vehicles
  public static getVehicles(): Vehicle[] {
    return this.load<Vehicle[]>(STORAGE_KEYS.VEHICLES, []);
  }

  public static saveVehicle(vehicle: Vehicle): void {
    const list = this.getVehicles();
    const index = list.findIndex(v => v.id === vehicle.id);
    if (index >= 0) {
      list[index] = { ...vehicle, updatedAt: new Date().toISOString() };
    } else {
      list.push({ ...vehicle, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.save(STORAGE_KEYS.VEHICLES, list);

    // Eğer aktif araç yoksa bunu aktif yap
    if (!this.getActiveVehicleId()) {
      this.setActiveVehicleId(vehicle.id);
    }
  }

  public static deleteVehicle(id: string): void {
    let list = this.getVehicles();
    list = list.filter(v => v.id !== id);
    this.save(STORAGE_KEYS.VEHICLES, list);

    // İlgili tüm kayıtları da temizle
    this.save(STORAGE_KEYS.MAINTENANCE, this.getMaintenanceRecords().filter(m => m.vehicleId !== id));
    this.save(STORAGE_KEYS.FUEL, this.getFuelRecords().filter(f => f.vehicleId !== id));
    this.save(STORAGE_KEYS.TIRES, this.getTireSets().filter(t => t.vehicleId !== id));
    this.save(STORAGE_KEYS.BATTERIES, this.getBatteryRecords().filter(b => b.vehicleId !== id));
    this.save(STORAGE_KEYS.SCHEDULE, this.getScheduleItems().filter(s => s.vehicleId !== id));

    if (this.getActiveVehicleId() === id) {
      this.setActiveVehicleId(list.length > 0 ? list[0].id : null);
    }
  }

  public static getActiveVehicleId(): string | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_VEHICLE_ID);
    if (raw) {
      let cleanId = raw;
      if (cleanId.startsWith('"') && cleanId.endsWith('"')) {
        try {
          const parsed = JSON.parse(cleanId);
          if (typeof parsed === 'string') {
            cleanId = parsed;
          }
        } catch {
          cleanId = cleanId.slice(1, -1);
        }
      }
      const list = this.getVehicles();
      if (list.some(v => v.id === cleanId)) {
        return cleanId;
      }
    }
    const list = this.getVehicles();
    return list.length > 0 ? list[0].id : null;
  }

  public static setActiveVehicleId(id: string | null): void {
    if (id) {
      const cleanId = (typeof id === 'string' && id.startsWith('"') && id.endsWith('"'))
        ? id.slice(1, -1)
        : id;
      localStorage.setItem(STORAGE_KEYS.ACTIVE_VEHICLE_ID, cleanId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_VEHICLE_ID);
    }
  }

  public static updateVehicleKm(vehicleId: string, newKm: number): void {
    const list = this.getVehicles();
    const index = list.findIndex(v => v.id === vehicleId);
    if (index >= 0) {
      if (newKm >= list[index].currentKm) {
        list[index].currentKm = newKm;
        list[index].updatedAt = new Date().toISOString();
        this.save(STORAGE_KEYS.VEHICLES, list);
      }
    }
  }

  // Maintenance
  public static getMaintenanceRecords(vehicleId?: string): MaintenanceRecord[] {
    const list = this.load<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE, []);
    const filtered = vehicleId ? list.filter(m => m.vehicleId === vehicleId) : list;
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public static saveMaintenanceRecord(record: MaintenanceRecord): void {
    const list = this.load<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE, []);
    const index = list.findIndex(m => m.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.push(record);
    }
    this.save(STORAGE_KEYS.MAINTENANCE, list);

    // Aracın KM'si girilen bakım KM'sinden küçükse güncelle
    this.updateVehicleKm(record.vehicleId, record.km);
  }

  public static deleteMaintenanceRecord(id: string): void {
    const list = this.load<MaintenanceRecord[]>(STORAGE_KEYS.MAINTENANCE, []);
    this.save(STORAGE_KEYS.MAINTENANCE, list.filter(m => m.id !== id));
  }

  // Fuel
  public static getFuelRecords(vehicleId?: string): FuelRecord[] {
    const list = this.load<FuelRecord[]>(STORAGE_KEYS.FUEL, []);
    const filtered = vehicleId ? list.filter(f => f.vehicleId === vehicleId) : list;
    return filtered.sort((a, b) => b.km - a.km);
  }

  public static saveFuelRecord(record: FuelRecord): void {
    const list = this.load<FuelRecord[]>(STORAGE_KEYS.FUEL, []);
    const index = list.findIndex(f => f.id === record.id);
    if (index >= 0) {
      list[index] = record;
    } else {
      list.push(record);
    }

    // Tüketim oranlarını yeniden hesapla
    const vehicleFuel = list
      .filter(f => f.vehicleId === record.vehicleId)
      .sort((a, b) => a.km - b.km);

    for (let i = 1; i < vehicleFuel.length; i++) {
      const prev = vehicleFuel[i - 1];
      const curr = vehicleFuel[i];
      const kmDiff = curr.km - prev.km;
      if (kmDiff > 0 && curr.isFullTank && prev.isFullTank) {
        curr.consumptionL100 = Number(((curr.liters / kmDiff) * 100).toFixed(2));
        curr.costPerKm = Number((curr.totalCost / kmDiff).toFixed(2));
      }
    }

    this.save(STORAGE_KEYS.FUEL, list);
    this.updateVehicleKm(record.vehicleId, record.km);
  }

  public static deleteFuelRecord(id: string): void {
    const list = this.load<FuelRecord[]>(STORAGE_KEYS.FUEL, []);
    this.save(STORAGE_KEYS.FUEL, list.filter(f => f.id !== id));
  }

  // Tires
  public static getTireSets(vehicleId?: string): TireSet[] {
    const list = this.load<TireSet[]>(STORAGE_KEYS.TIRES, []);
    return vehicleId ? list.filter(t => t.vehicleId === vehicleId) : list;
  }

  public static saveTireSet(tire: TireSet): void {
    const list = this.load<TireSet[]>(STORAGE_KEYS.TIRES, []);
    const index = list.findIndex(t => t.id === tire.id);

    // Eğer bu lastik takılı olarak işaretlendiyse, aynı aracın diğer lastik setlerini pasife al
    if (tire.isCurrentlyInstalled) {
      list.forEach(t => {
        if (t.vehicleId === tire.vehicleId && t.id !== tire.id) {
          t.isCurrentlyInstalled = false;
        }
      });
    }

    if (index >= 0) {
      list[index] = tire;
    } else {
      list.push(tire);
    }
    this.save(STORAGE_KEYS.TIRES, list);
  }

  public static deleteTireSet(id: string): void {
    const list = this.load<TireSet[]>(STORAGE_KEYS.TIRES, []);
    this.save(STORAGE_KEYS.TIRES, list.filter(t => t.id !== id));
  }

  public static setTireMounted(tireId: string, currentKm: number): void {
    const list = this.load<TireSet[]>(STORAGE_KEYS.TIRES, []);
    const tire = list.find(t => t.id === tireId);
    if (!tire) return;

    // Önceki takılı olan lastiğin KM'sini güncelle
    const previouslyMounted = list.find(t => t.vehicleId === tire.vehicleId && t.isCurrentlyInstalled && t.id !== tireId);
    if (previouslyMounted && previouslyMounted.lastMountedKm) {
      const usedNow = Math.max(0, currentKm - previouslyMounted.lastMountedKm);
      previouslyMounted.totalKmUsed = (previouslyMounted.totalKmUsed || 0) + usedNow;
      previouslyMounted.isCurrentlyInstalled = false;
    }

    tire.isCurrentlyInstalled = true;
    tire.lastMountedDate = new Date().toISOString().split('T')[0];
    tire.lastMountedKm = currentKm;

    this.save(STORAGE_KEYS.TIRES, list);
  }

  // Batteries
  public static getBatteryRecords(vehicleId?: string): BatteryRecord[] {
    const list = this.load<BatteryRecord[]>(STORAGE_KEYS.BATTERIES, []);
    const filtered = vehicleId ? list.filter(b => b.vehicleId === vehicleId) : list;
    return filtered.sort((a, b) => new Date(b.changeDate).getTime() - new Date(a.changeDate).getTime());
  }

  public static saveBatteryRecord(battery: BatteryRecord): void {
    const list = this.load<BatteryRecord[]>(STORAGE_KEYS.BATTERIES, []);
    if (battery.isActive) {
      list.forEach(b => {
        if (b.vehicleId === battery.vehicleId && b.id !== battery.id) {
          b.isActive = false;
        }
      });
    }

    const index = list.findIndex(b => b.id === battery.id);
    if (index >= 0) {
      list[index] = battery;
    } else {
      list.push(battery);
    }
    this.save(STORAGE_KEYS.BATTERIES, list);
  }

  public static deleteBatteryRecord(id: string): void {
    const list = this.load<BatteryRecord[]>(STORAGE_KEYS.BATTERIES, []);
    this.save(STORAGE_KEYS.BATTERIES, list.filter(b => b.id !== id));
  }

  // Schedule / Reminders
  public static getScheduleItems(vehicleId?: string): MaintenanceScheduleItem[] {
    const list = this.load<MaintenanceScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    return vehicleId ? list.filter(s => s.vehicleId === vehicleId) : list;
  }

  public static saveScheduleItem(item: MaintenanceScheduleItem): void {
    const list = this.load<MaintenanceScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    const index = list.findIndex(s => s.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.push(item);
    }
    this.save(STORAGE_KEYS.SCHEDULE, list);
  }

  public static deleteScheduleItem(id: string): void {
    const list = this.load<MaintenanceScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    this.save(STORAGE_KEYS.SCHEDULE, list.filter(s => s.id !== id));
  }

  public static createDefaultSchedulesForVehicle(vehicleId: string, currentKm: number): void {
    const existing = this.getScheduleItems(vehicleId);
    if (existing.length > 0) return;

    const today = new Date().toISOString().split('T')[0];
    const newItems: MaintenanceScheduleItem[] = DEFAULT_SCHEDULE_TEMPLATES.map((tmpl, idx) => {
      let targetKm: number | undefined;
      let targetDate: string | undefined;

      if (tmpl.intervalKm) {
        targetKm = currentKm + tmpl.intervalKm;
      }

      if (tmpl.intervalMonths) {
        const d = new Date();
        d.setMonth(d.getMonth() + tmpl.intervalMonths);
        targetDate = d.toISOString().split('T')[0];
      }

      return {
        id: `sch-${vehicleId}-${Date.now()}-${idx}`,
        vehicleId,
        title: tmpl.title,
        category: tmpl.category,
        intervalKm: tmpl.intervalKm,
        intervalMonths: tmpl.intervalMonths,
        lastDoneKm: currentKm,
        lastDoneDate: today,
        targetKm,
        targetDate,
        notes: tmpl.notes,
        isDefaultTemplate: true,
      };
    });

    const all = this.load<MaintenanceScheduleItem[]>(STORAGE_KEYS.SCHEDULE, []);
    this.save(STORAGE_KEYS.SCHEDULE, [...all, ...newItems]);
  }

  // Full Backup / Export / Import
  public static exportAllData(): string {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      vehicles: this.getVehicles(),
      maintenance: this.getMaintenanceRecords(),
      fuel: this.getFuelRecords(),
      tires: this.getTireSets(),
      batteries: this.getBatteryRecords(),
      schedules: this.getScheduleItems(),
    };
    return JSON.stringify(backup, null, 2);
  }

  public static importAllData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.vehicles)) {
        throw new Error('Geçersiz yedek dosyası formatı');
      }

      this.save(STORAGE_KEYS.VEHICLES, data.vehicles || []);
      this.save(STORAGE_KEYS.MAINTENANCE, data.maintenance || []);
      this.save(STORAGE_KEYS.FUEL, data.fuel || []);
      this.save(STORAGE_KEYS.TIRES, data.tires || []);
      this.save(STORAGE_KEYS.BATTERIES, data.batteries || []);
      this.save(STORAGE_KEYS.SCHEDULE, data.schedules || []);

      if (data.vehicles.length > 0) {
        this.setActiveVehicleId(data.vehicles[0].id);
      }
      return true;
    } catch (e) {
      console.error('Yedek yükleme hatası:', e);
      return false;
    }
  }
}
