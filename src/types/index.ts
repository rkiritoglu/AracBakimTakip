export type FuelType = 'benzin' | 'dizel' | 'lpg' | 'hibrit' | 'elektrik';
export type TransmissionType = 'manuel' | 'otomatik';
export type MaintenanceCategory = 'periyodik' | 'agir' | 'onarım' | 'kaporta_boya' | 'muayene' | 'diger';
export type TireSeason = 'yazlik' | 'kislik' | 'dort_mevsim';
export type BatteryTechnology = 'kursun_asit' | 'efb' | 'agm' | 'jel';
export type ExpenseCategory = 'yakit' | 'bakim' | 'lastik' | 'aku' | 'sigorta' | 'vergi' | 'otoyol' | 'yikama' | 'aksesuar' | 'diger';

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  subModel?: string; // örn: 1.6 TDI Highline DSG
  year: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  currentKm: number;
  engineCapacity?: string; // örn: 1598 cc
  enginePower?: string; // örn: 115 HP
  vin?: string; // Şasi No
  engineNo?: string;
  engineOilSpec?: string; // örn: 5W-30 VW 504.00/507.00
  oilCapacityLiters?: number; // örn: 4.6
  inspectionDate?: string; // TÜVTÜRK Muayene YYYY-MM-DD
  insuranceDate?: string; // Trafik Sigortası YYYY-MM-DD
  cascoDate?: string; // Kasko YYYY-MM-DD
  color: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenancePart {
  id: string;
  name: string; // örn: Castrol Edge 5W-30 LL 4L
  partNumber?: string; // OEM veya Üretici Parça Kodu
  brand?: string; // örn: Mann, Bosch, Castrol
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  km: number;
  type: MaintenanceCategory;
  title: string;
  serviceName: string; // Yetkili Servis, Özel Servis vs.
  serviceLocation?: string;
  laborCost: number; // İşçilik
  parts: MaintenancePart[];
  totalCost: number;
  notes?: string;
  invoiceNumber?: string;
  nextMaintenanceKm?: number;
  nextMaintenanceDate?: string;
  createdAt: string;
}

export interface FuelRecord {
  id: string;
  vehicleId: string;
  date: string;
  km: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  isFullTank: boolean;
  station?: string;
  fuelType: FuelType;
  consumptionL100?: number; // Otomatik hesaplanan L/100km
  costPerKm?: number; // TL/KM
  notes?: string;
  createdAt: string;
}

export interface TireSet {
  id: string;
  vehicleId: string;
  season: TireSeason;
  brand: string; // Continental, Goodyear vs.
  model: string; // UltraGrip 9, PremiumContact 7
  size: string; // 205/55 R16 91V
  dot?: string; // Hafta/Yıl: 3422
  treadDepthMm?: number; // Diş derinliği mm
  purchaseDate?: string;
  purchaseKm?: number;
  purchasePrice?: number;
  isCurrentlyInstalled: boolean;
  lastMountedDate?: string;
  lastMountedKm?: number;
  totalKmUsed: number;
  storageLocation?: string; // Lastikçi oteli, Garaj vs.
  notes?: string;
  createdAt: string;
}

export interface BatteryRecord {
  id: string;
  vehicleId: string;
  brand: string; // Varta, Mutlu, İnci
  model: string; // Silver Dynamic AGM
  capacityAh: number; // 70 Ah
  ccaA: number; // 760 A
  technology: BatteryTechnology;
  changeDate: string;
  changeKm: number;
  cost: number;
  vendor?: string;
  warrantyMonths: number;
  warrantyEndDate?: string;
  isActive: boolean;
  voltage?: number; // Son ölçüm voltajı örn: 12.6V
  notes?: string;
  createdAt: string;
}

export interface MaintenanceScheduleItem {
  id: string;
  vehicleId: string;
  title: string; // örn: Motor Yağı ve Yağ Filtresi Değişimi
  category: 'periyodik' | 'sivi' | 'parca' | 'yasal' | 'lastik' | 'agir' | 'diger';
  intervalKm?: number; // örn: 10000 km
  intervalMonths?: number; // örn: 12 ay
  lastDoneKm?: number;
  lastDoneDate?: string;
  targetKm?: number;
  targetDate?: string;
  notes?: string;
  isDefaultTemplate?: boolean;
}

export interface ReminderNotification {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  type: 'danger' | 'warning' | 'info';
  category: string;
  remainingKm?: number;
  remainingDays?: number;
  dueDate?: string;
  targetKm?: number;
}
