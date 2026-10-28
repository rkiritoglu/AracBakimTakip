import { 
  Vehicle, 
  MaintenanceRecord, 
  FuelRecord, 
  TireSet, 
  BatteryRecord, 
  MaintenanceScheduleItem, 
  ReminderNotification 
} from '../types';

export const formatCurrency = (val: number | undefined | null): string => {
  if (val === undefined || val === null || isNaN(val)) return '0,00 ₺';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
};

export const formatKm = (km: number | undefined | null): string => {
  if (km === undefined || km === null || isNaN(km)) return '0 km';
  return `${new Intl.NumberFormat('tr-TR').format(Math.round(km))} km`;
};

export const formatDate = (dateStr: string | undefined | null): string => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
};

export const calculateDaysBetween = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
};

export interface FuelStats {
  totalCost: number;
  totalLiters: number;
  avgConsumptionL100: number; // L/100km
  avgCostPerKm: number; // TL/km
  fillCount: number;
  lastFuelDate: string | null;
  lastPricePerLiter: number | null;
}

export const calculateFuelStats = (records: FuelRecord[]): FuelStats => {
  if (!records || records.length === 0) {
    return {
      totalCost: 0,
      totalLiters: 0,
      avgConsumptionL100: 0,
      avgCostPerKm: 0,
      fillCount: 0,
      lastFuelDate: null,
      lastPricePerLiter: null,
    };
  }

  const sorted = [...records].sort((a, b) => b.km - a.km);
  const totalCost = sorted.reduce((sum, r) => sum + (r.totalCost || 0), 0);
  const totalLiters = sorted.reduce((sum, r) => sum + (r.liters || 0), 0);

  // İki tam depo arasındaki tüketimlerin ortalaması
  const validConsumptions = sorted
    .filter(r => r.consumptionL100 && r.consumptionL100 > 0)
    .map(r => r.consumptionL100!);

  const avgConsumptionL100 = validConsumptions.length > 0
    ? Number((validConsumptions.reduce((a, b) => a + b, 0) / validConsumptions.length).toFixed(2))
    : 0;

  // KM farkına göre ortalama maliyet
  let avgCostPerKm = 0;
  if (sorted.length > 1) {
    const maxKm = sorted[0].km;
    const minKm = sorted[sorted.length - 1].km;
    const diffKm = maxKm - minKm;
    if (diffKm > 0) {
      avgCostPerKm = Number((totalCost / diffKm).toFixed(2));
    }
  }

  return {
    totalCost,
    totalLiters,
    avgConsumptionL100,
    avgCostPerKm,
    fillCount: sorted.length,
    lastFuelDate: sorted[0]?.date || null,
    lastPricePerLiter: sorted[0]?.pricePerLiter || null,
  };
};

export interface MaintenanceStats {
  totalCost: number;
  totalLaborCost: number;
  totalPartsCost: number;
  recordCount: number;
  lastMaintenanceDate: string | null;
  lastMaintenanceKm: number | null;
}

export const calculateMaintenanceStats = (records: MaintenanceRecord[]): MaintenanceStats => {
  if (!records || records.length === 0) {
    return {
      totalCost: 0,
      totalLaborCost: 0,
      totalPartsCost: 0,
      recordCount: 0,
      lastMaintenanceDate: null,
      lastMaintenanceKm: null,
    };
  }

  const sorted = [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let totalCost = 0;
  let totalLaborCost = 0;
  let totalPartsCost = 0;

  sorted.forEach(rec => {
    totalCost += rec.totalCost || 0;
    totalLaborCost += rec.laborCost || 0;
    const partsSum = rec.parts?.reduce((sum, p) => sum + (p.totalPrice || 0), 0) || 0;
    totalPartsCost += partsSum;
  });

  return {
    totalCost,
    totalLaborCost,
    totalPartsCost,
    recordCount: sorted.length,
    lastMaintenanceDate: sorted[0]?.date || null,
    lastMaintenanceKm: sorted[0]?.km || null,
  };
};

export interface OverallExpenses {
  fuelCost: number;
  maintenanceCost: number;
  partsCostOnly: number;
  laborCostOnly: number;
  tiresCost: number;
  batteryCost: number;
  totalExpense: number;
  costPerKm: number;
}

export const calculateOverallExpenses = (
  vehicle: Vehicle | null,
  maintenanceRecords: MaintenanceRecord[],
  fuelRecords: FuelRecord[],
  tires: TireSet[],
  batteries: BatteryRecord[]
): OverallExpenses => {
  const fuelCost = fuelRecords.reduce((sum, r) => sum + (r.totalCost || 0), 0);
  
  let maintenanceCost = 0;
  let partsCostOnly = 0;
  let laborCostOnly = 0;
  maintenanceRecords.forEach(m => {
    maintenanceCost += m.totalCost || 0;
    laborCostOnly += m.laborCost || 0;
    m.parts?.forEach(p => {
      partsCostOnly += p.totalPrice || 0;
    });
  });

  const tiresCost = tires.reduce((sum, t) => sum + (t.purchasePrice || 0), 0);
  const batteryCost = batteries.reduce((sum, b) => sum + (b.cost || 0), 0);

  const totalExpense = fuelCost + maintenanceCost + tiresCost + batteryCost;
  
  // Araç için tahmini katedilen km veya mevcut km
  const currentKm = vehicle?.currentKm || 1;
  const costPerKm = currentKm > 0 ? Number((totalExpense / currentKm).toFixed(2)) : 0;

  return {
    fuelCost,
    maintenanceCost,
    partsCostOnly,
    laborCostOnly,
    tiresCost,
    batteryCost,
    totalExpense,
    costPerKm,
  };
};

// Akıllı Hatırlatıcı Üreteci
export const generateReminders = (
  vehicle: Vehicle,
  schedules: MaintenanceScheduleItem[],
  tires: TireSet[],
  battery: BatteryRecord | null
): ReminderNotification[] => {
  const reminders: ReminderNotification[] = [];
  const today = new Date();
  const currentKm = vehicle.currentKm;

  // 1. Bakım Planı Kalemleri
  schedules.forEach(item => {
    let isUrgent = false;
    let isWarning = false;
    let desc = '';
    let remKm: number | undefined;
    let remDays: number | undefined;

    if (item.targetKm !== undefined && item.targetKm !== null) {
      remKm = item.targetKm - currentKm;
      if (remKm <= 0) {
        isUrgent = true;
        desc = `KM sınırı aşıldı! (${Math.abs(remKm)} km gecikti)`;
      } else if (remKm <= 1000) {
        isWarning = true;
        desc = `${formatKm(remKm)} kaldı (${formatKm(item.targetKm)} hedeflenen)`;
      } else {
        desc = `${formatKm(remKm)} kaldı`;
      }
    }

    if (item.targetDate) {
      const days = calculateDaysBetween(today, item.targetDate);
      remDays = days;
      if (days <= 0) {
        isUrgent = true;
        const msg = `Süre doldu! (${Math.abs(days)} gün gecikti)`;
        desc = desc ? `${desc} | ${msg}` : msg;
      } else if (days <= 30) {
        isWarning = true;
        const msg = `${days} gün kaldı (${formatDate(item.targetDate)})`;
        desc = desc ? `${desc} | ${msg}` : msg;
      }
    }

    if (isUrgent) {
      reminders.push({
        id: `rem-sch-${item.id}`,
        vehicleId: vehicle.id,
        title: item.title,
        description: desc || 'Bakım zamanı geldi!',
        type: 'danger',
        category: 'Bakım Takvimi',
        remainingKm: remKm,
        remainingDays: remDays,
        targetKm: item.targetKm || undefined,
        dueDate: item.targetDate,
      });
    } else if (isWarning) {
      reminders.push({
        id: `rem-sch-${item.id}`,
        vehicleId: vehicle.id,
        title: item.title,
        description: desc,
        type: 'warning',
        category: 'Bakım Takvimi',
        remainingKm: remKm,
        remainingDays: remDays,
        targetKm: item.targetKm || undefined,
        dueDate: item.targetDate,
      });
    }
  });

  // 2. Muayene (TÜVTÜRK)
  if (vehicle.inspectionDate) {
    const days = calculateDaysBetween(today, vehicle.inspectionDate);
    if (days <= 0) {
      reminders.push({
        id: `rem-insp-${vehicle.id}`,
        vehicleId: vehicle.id,
        title: 'TÜVTÜRK Araç Muayenesi Gecikti!',
        description: `Muayene süresi ${Math.abs(days)} gün önce doldu (${formatDate(vehicle.inspectionDate)}). Cezai işlem uygulanabilir!`,
        type: 'danger',
        category: 'Yasal Zorunluluk',
        remainingDays: days,
        dueDate: vehicle.inspectionDate,
      });
    } else if (days <= 30) {
      reminders.push({
        id: `rem-insp-${vehicle.id}`,
        vehicleId: vehicle.id,
        title: 'TÜVTÜRK Muayenesi Yaklaştı',
        description: `Muayene için ${days} gün kaldı (${formatDate(vehicle.inspectionDate)}). Randevunuzu alın.`,
        type: 'warning',
        category: 'Yasal Zorunluluk',
        remainingDays: days,
        dueDate: vehicle.inspectionDate,
      });
    }
  }

  // 3. Trafik Sigortası & Kasko
  if (vehicle.insuranceDate) {
    const days = calculateDaysBetween(today, vehicle.insuranceDate);
    if (days <= 0) {
      reminders.push({
        id: `rem-insur-${vehicle.id}`,
        vehicleId: vehicle.id,
        title: 'Zorunlu Trafik Sigortası Bitti!',
        description: `Poliçe süresi doldu. Araç trafikte ceza ve bağlanma riski taşır!`,
        type: 'danger',
        category: 'Sigorta',
        remainingDays: days,
        dueDate: vehicle.insuranceDate,
      });
    } else if (days <= 20) {
      reminders.push({
        id: `rem-insur-${vehicle.id}`,
        vehicleId: vehicle.id,
        title: 'Trafik Sigortası Yenileme Zamanı',
        description: `Poliçe bitimine ${days} gün kaldı (${formatDate(vehicle.insuranceDate)}).`,
        type: 'warning',
        category: 'Sigorta',
        remainingDays: days,
        dueDate: vehicle.insuranceDate,
      });
    }
  }

  // 4. Lastikler Kontrolü
  const mountedTire = tires.find(t => t.isCurrentlyInstalled);
  if (mountedTire) {
    // Diş derinliği kontrolü (Türkiye yasal sınırı 1.6mm, güvenli sınır 3.0mm veya kışlık için 4.0mm)
    if (mountedTire.treadDepthMm !== undefined) {
      if (mountedTire.treadDepthMm <= 2.0) {
        reminders.push({
          id: `rem-tire-tread-${mountedTire.id}`,
          vehicleId: vehicle.id,
          title: 'Kritik Lastik Diş Derinliği!',
          description: `Takılı lastiklerin diş derinliği ${mountedTire.treadDepthMm} mm seviyesine indi. Değişim şarttır!`,
          type: 'danger',
          category: 'Lastik',
        });
      } else if (mountedTire.treadDepthMm <= 3.5) {
        reminders.push({
          id: `rem-tire-tread-${mountedTire.id}`,
          vehicleId: vehicle.id,
          title: 'Lastik Diş Derinliği Uyarısı',
          description: `Diş derinliği ${mountedTire.treadDepthMm} mm. Islak zeminde kızaklama riski artabilir.`,
          type: 'warning',
          category: 'Lastik',
        });
      }
    }

    // Mevsimsel Lastik Değişim Uyarısı (Kasım - Nisan kışlık dönemi)
    const currentMonth = today.getMonth() + 1; // 1-12
    if ((currentMonth === 11 || currentMonth === 12) && mountedTire.season === 'yazlik') {
      reminders.push({
        id: `rem-tire-winter-${mountedTire.id}`,
        vehicleId: vehicle.id,
        title: 'Kışlık Lastik Takma Vakti',
        description: `Aracınızda yazlık lastikler takılı. 1 Aralık kış lastiği zorunluluğu öncesinde kışlık lastiklerinizi takmanız önerilir.`,
        type: 'warning',
        category: 'Lastik',
      });
    } else if ((currentMonth >= 4 && currentMonth <= 5) && mountedTire.season === 'kislik') {
      reminders.push({
        id: `rem-tire-summer-${mountedTire.id}`,
        vehicleId: vehicle.id,
        title: 'Yazlık Lastik Takma Vakti',
        description: `Hava sıcaklıkları 7°C üzerine çıktığı için kışlık lastikler aşırı yıpranır. Yazlık lastiklerinize geçiş yapınız.`,
        type: 'info',
        category: 'Lastik',
      });
    }
  }

  // 5. Akü Kontrolü
  if (battery && battery.isActive) {
    if (battery.warrantyEndDate) {
      const days = calculateDaysBetween(today, battery.warrantyEndDate);
      if (days <= 30 && days > 0) {
        reminders.push({
          id: `rem-bat-warn-${battery.id}`,
          vehicleId: vehicle.id,
          title: 'Akü Garantisi Bitiyor',
          description: `Akü garanti süresinin bitmesine ${days} gün kaldı (${formatDate(battery.warrantyEndDate)}). Serviste ücretsiz sağlık testi yaptırabilirsiniz.`,
          type: 'info',
          category: 'Akü',
          remainingDays: days,
          dueDate: battery.warrantyEndDate,
        });
      }
    }

    if (battery.voltage && battery.voltage < 12.2) {
      reminders.push({
        id: `rem-bat-volt-${battery.id}`,
        vehicleId: vehicle.id,
        title: 'Düşük Akü Voltajı!',
        description: `Akü voltajı ${battery.voltage}V seviyesinde (Kritik). Marş basmama riski var. Şarj veya akü kontrolü gerekebilir.`,
        type: 'danger',
        category: 'Akü',
      });
    }
  }

  // Tehlike sırasına göre sırala (danger önce, warning sonra, info en son)
  const priorityMap = { danger: 0, warning: 1, info: 2 };
  return reminders.sort((a, b) => priorityMap[a.type] - priorityMap[b.type]);
};
