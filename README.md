# OtoBakım Pro - Araç Bakım, Yakıt & Parça Takip Sistemi

Modern, hızlı ve çevrimdışı (offline) çalışabilen, hem masaüstü hem de mobil cihazlarla tam uyumlu araç takip ve bakım yönetim uygulaması.

---

## 🚗 Öne Çıkan Özellikler

### 1. Bakım & Yedek Parça Yönetimi
- **Servis Geçmişi:** Tarih, kilometre, servis/usta adı, fatura numarası ve işçilik bedeli.
- **Dinamik Parça Listesi:** Her bakım için kullanılan yedek parçaların adı, markası, OEM / parça kodu, adedi, birim fiyatı ve toplam maliyetleri.
- **Bakım Türleri:** Periyodik Bakım, Ağır Bakım (Triger, Debriyaj vb.), Arıza/Mekanik Onarım, Kaporta/Boya vb.
- **Arama & Filtreleme:** Parça adına veya işlem detayına göre anında arama.

### 2. Yakıt & KM Takibi
- **Dolum Kayıtları:** Tarih, kilometre, alınan litre, litre fiyatı ve toplam tutar.
- **Tüketim Hesaplama (L/100km):** İki tam depo dolumu arasında otomatik hesaplanan yakıt tüketimi.
- **Birim Maliyet:** Kilometre başına düşen yakıt harcaması (₺/km).
- **Akıllı Hesaplayıcı:** Litre girildiğinde tutarı, tutar girildiğinde litreyi otomatik hesaplama.

### 3. Lastik & Akü Takibi
- **Lastik Yönetimi:**
  - Yazlık, Kışlık (M+S 3PMSF) ve Dört Mevsim setleri.
  - Ebat (örn: 205/55 R16), DOT üretim yılı/haftası, satın alma bedeli.
  - Kalan diş derinliği (mm) ve güvenlik renk skalası.
  - "Bu Seti Araca Tak" butonu ile mevsimsel geçişlerde tek tıkla aktif lastiği değiştirme ve kilometre eşitleme.
  - Saklama yeri (Lastik oteli fiş no, garaj vb.).
- **Akü Yönetimi:**
  - Marka, model, kapasite (Ah), soğuk marş akımı (CCA) ve akü teknolojisi (AGM, EFB, Kurşun-Asit, Jel).
  - Garanti süresi sayacı ve kalan gün/ay göstergesi.
  - Akü voltajı ve sağlık ölçümü takibi (12.6V+ sağlıklı).

### 4. Bakım Aralıkları & Akıllı Hatırlatıcılar
- **Ön Tanımlı Standart Şablonlar:** Motor yağı & filtresi (10.000 km / 1 yıl), hava ve polen filtreleri, yakıt filtresi, fren balataları, fren hidroliği, bujiler, triger seti & devirdaim (80.000 km / 5 yıl), şanzıman yağı vb.
- **Yasal Süreler:** TÜVTÜRK araç muayenesi, Zorunlu Trafik Sigortası ve Kasko vade tarihleri.
- **Görsel İlerleme:** Kalan kilometre ve kalan gün çubukları.
- **"Bakımı Yapıldı Olarak İşle":** Bakım yapıldığında tek tıkla periyodu güncelleyerek sonraki hedefi otomatik öteleme.

### 5. Masraf Raporları & Analitik (TCO)
- **Toplam Mülkiyet Maliyeti (TCO):** Araç için harcanan tüm masrafların (yakıt + bakım + parçalar + işçilik + lastik + akü) dökümü.
- **Kilometre Başına Toplam Masraf (₺/km).**
- **Kategori Dağılım Grafiği:** Yakıt, Parça, İşçilik, Lastik ve Akü yüzdelik dağılımı.
- **CSV / Excel Dışa Aktarma:** Bakım ve yakıt kayıtlarını Excel uyumlu CSV olarak indirme.
- **Yazdır / PDF:** Sayfayı yazdırmaya veya PDF olarak kaydetmeye uygun format.

### 6. Veri Güvenliği, Yedekleme & PWA
- **Yerel Depolama:** Verileriniz tamamen tarayıcınızın yerel hafızasında saklanır, harici sunucuya ihtiyaç duymaz.
- **JSON Yedekleme:** Tek tıkla tüm aracın ve geçmişin tam yedeğini `.json` olarak indirme ve geri yükleme.
- **Çoklu Araç Desteği:** Birden fazla araç ekleyip aralarında hızlıca geçiş yapabilme.
- **Karanlık / Açık Mod (Dark Mode):** Gece sürüşleri ve düşük ışık için tam karanlık tema.
- **PWA Kurulumu:** Telefonunuzda veya bilgisayarınızda "Uygulamayı Yükle" diyerek native uygulama gibi kullanabilme.

---

## 🚀 Çalıştırma

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Ardından tarayıcınızdan açın:
- **Yerel:** [http://localhost:5173/](http://localhost:5173/)
- **Telefon / Ağdaki Diğer Cihazlar:** `http://<BILGISAYAR_IP_ADRESINIZ>:5173/`
