# Futbol Okullari - Spor Kulubu Yonetim Sistemi

## Genel Bakis

Coklu bayi (franchise) destekli, 3 dilli (TR/EN/ES), KVKK uyumlu spor kulubu yonetim sistemi.

## Teknik Yapi

| Bilesen | Teknoloji |
|---------|-----------|
| Framework | Next.js 16 (App Router) |
| Veritabani | SQLite + Prisma ORM |
| Kimlik Dogrulama | NextAuth.js v5 |
| UI | Shadcn/ui + Tailwind CSS v4 |
| Dil Destegi | i18n (TR, EN, ES) |
| Odeme | PayTR |
| SMS | Netgsm |

## Kullanici Rolleri

1. **SUPER_ADMIN** - Tum bayileri yonetir
2. **DEALER_ADMIN** - Kendi spor kulubunu yonetir (izinlere gore)
3. **TRAINER** - Yoklama ve ogrenci goruntuleme

## Kurulum

```bash
# Bagimliliklari kur
npm install

# Veritabanini olustur ve migrate et
npm run db:migrate

# Ornek verileri yukle
npm run db:seed

# Gelistirme sunucusunu baslat
npm run dev
```

## Giris Bilgileri (Demo)

| Rol | E-posta | Sifre |
|-----|---------|-------|
| SuperAdmin | admin@futbolokullari.com | Admin123! |
| Dealer Admin | bayi@demospor.com | Dealer123! |

## Proje Yapisi

```
futbol-okullari/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Dil bazli rotalar
│   │   ├── (auth)/        # Giris sayfalari
│   │   └── (dashboard)/   # Dashboard sayfalari
│   └── api/               # API rotalar
├── components/            # React bilesenleri
│   ├── ui/               # Shadcn bilesenleri
│   ├── layout/           # Layout bilesenleri
│   └── forms/            # Form bilesenleri
├── lib/                   # Yardimci fonksiyonlar
│   ├── auth.ts           # NextAuth yapilandirmasi
│   ├── prisma.ts         # Prisma client
│   ├── logger.ts         # Loglama
│   ├── i18n/             # Coklu dil
│   └── utils/            # Yardimci fonksiyonlar
├── prisma/               # Veritabani
│   ├── schema.prisma     # Veritabani semasi
│   └── seed.ts           # Ornek veriler
├── dictionaries/         # Dil dosyalari
│   ├── tr.json           # Turkce
│   ├── en.json           # Ingilizce
│   └── es.json           # Ispanyolca
└── docs/                 # Dokumantasyon
```

## Komutlar

| Komut | Aciklama |
|-------|----------|
| `npm run dev` | Gelistirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Production sunucusu |
| `npm run lint` | ESLint kontrolu |
| `npm run db:generate` | Prisma client olustur |
| `npm run db:migrate` | Migration calistir |
| `npm run db:seed` | Ornek verileri yukle |
| `npm run db:studio` | Prisma Studio ac |

## Moduller

### 1. Onkayit (Pre-registration)
On kayitli ogrencileri yonetme, tam kayda donusturme.

### 2. Ogrenciler (Students)
Ogrenci CRUD, brans/tesis/grup filtreleme, odeme ve yoklama gecmisi.

### 3. Antrenorler (Trainers)
Antrenor CRUD, maas yonetimi, mobil kullanici olusturma.

### 4. Gruplar (Groups)
Grup CRUD, program yonetimi, kapasite takibi.

### 5. Yoklamalar (Attendance)
Grup/tarih bazli yoklama alma, raporlama.

### 6. Muhasebe (Accounting)
- Odemeler: Odeme listesi, geciken/yaklasan odemeler
- Kasa: Gelir/gider yonetimi
- Gunluk Durum: Anlik kasa durumu
- Online Odemeler: PayTR entegrasyonu

### 7. Raporlar (Reports)
Genel, yoklama, malzeme, maas ve dogum gunu raporlari.

### 8. SMS
Netgsm entegrasyonu ile toplu SMS gonderimi.

### 9. Kullanicilar (Users)
Kullanici CRUD ve izin yonetimi.

### 10. Ayarlar (Settings)
Donemler, branslar, subeler, tesisler ve diger tanimlamalar.

## Guvenlik (KVKK/GDPR)

- PII veriler (TC Kimlik, IBAN) AES-256-GCM ile sifrelenir
- Loglarda hassas veriler maskelenir
- Audit trail ile tum kritik islemler kaydedilir
- Security headers middleware ile eklenir

## Lisans

Tum haklari saklidir.
