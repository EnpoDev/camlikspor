# UI/UX TASARIM SPESİFİKASYONU
## Futbol Okulu Web Sitesi — Valencia CF Tarzı Modernizasyon

**Referans:** valenciacf.com analizi
**Proje:** Next.js 15 + Tailwind CSS v4 + shadcn/ui
**Renk Teması:** Sarı-Kırmızı (Mevcut theme korunuyor)
**Tarih:** 2026-03-16

---

## MEVCUT DURUM & GENEL STRATEJİ

Projede tum ana component'lar mevcut. Bu spec, var olan component'larin Valencia CF'nin profesyonel spor sitesi estetigine uygun sekilde **revize edilmesini** tanimlar. Yeni component olusturmak yerine mevcut dosyalar uzerinde calisilacak.

### Mevcut Tema Token'lari (globals.css)
```
--primary: oklch(0.50 0.22 25)     → Koyu kirmizi (#C8102E civari)
--secondary: oklch(0.88 0.12 85)   → Sari/altin (#FFD700 civari)
--primary-foreground: oklch(0.985) → Beyaz
```
Bu token'lar korunacak. Ek renk ihtiyaclari icin Tailwind utility class'lari kullanilacak.

---

## 1. HEADER — `components/public/public-header.tsx`

### Mevcut Durum
- Sticky header var, scroll'da bg-white gecisi mevcut
- 100px yukseklik, logo + nav + actions
- Mobile hamburger menu var

### Yapilacak Degisiklikler

#### 1.1 Scroll Gecisi (Transparan → Solid)
- **Scroll oncesi:** `bg-transparent` (mevcut, calisir)
- **Scroll sonrasi:** `bg-white/95 backdrop-blur-lg` yerine koyu kirmizi secenegi de desteklenmeli
- Header yuksekligi: Desktop **80px** (100px'den dusur), Mobile **64px**
- `z-index: 50` (mevcut, yeterli)

#### 1.2 Logo Alani
- Logo max-height: **50px** (mevcut 64px'den kucult)
- Logo container: Beyaz daire bg korunsun, shadow hafifletilsin

#### 1.3 Navigation Stili
- Font: **14px, font-semibold, uppercase, tracking-wide** (mevcut kucuk harf, buyuk harfe cevir)
- Hover efekti: Mevcut alt cizgi animasyonu korunsun, renk `bg-secondary` (sari) yapilsin — **2px, slide-in soldan saga**
- Aktif sayfa: Sari alt cizgi surekli gorunsun
- Icon'lar nav item'lardan kaldirilsin (daha temiz gorunum — Valencia tarzinda icon yok)

#### 1.4 Sag Taraf Aksiyonlar
- Telefon numarasi gosterilsin (desktop): `0532 241 24 31` — Phone icon + numara
- **"On Kayit" CTA butonu** eklensin: `bg-secondary text-secondary-foreground` (sari bg, koyu text), `font-bold`, `rounded-full`, `px-6 py-2`
- Dil secici ve login icon korunsun

#### 1.5 Mobile Menu
- Full-screen overlay: `bg-white` veya `bg-slate-900` secenegi
- Menu acildiginda logo + kapatma butonu ust kisimda
- Nav linkleri: Buyuk font (18px), aralarinda ince separator
- Alt kisimda sticky bar: "On Kayit" + "Ara" butonlari (her zaman gorunur)

### Tailwind Class Ornekleri
```
Header: h-20 md:h-20 (80px)
Nav link: text-sm font-semibold uppercase tracking-wider
CTA button: bg-secondary text-secondary-foreground font-bold rounded-full px-6 py-2.5 hover:bg-secondary/90
Hover underline: h-0.5 bg-secondary (sari)
```

---

## 2. HERO SLIDER — `components/public/hero-slider.tsx`

### Mevcut Durum
- Full-width, min-h-[90vh], fade transition
- Overlay: `bg-gradient-to-br from-black/70 via-black/60 to-primary/70`
- Badge, title, subtitle, 2 CTA, feature badges
- Auto-advance 5sn, WCAG uyumlu pause

### Yapilacak Degisiklikler

#### 2.1 Boyut & Layout
- Height: **70vh desktop, 50vh mobile** (90vh fazla, azalt)
- Text alignment: **Sol-alt** (mevcut center, Valencia tarzinda sol-alt)
- Max-width content: `max-w-2xl` sola yaslı (`mx-auto text-center` yerine `text-left`)

#### 2.2 Overlay
- Mevcut gradient iyi, korunsun: `from-black/70 via-black/60 to-primary/70`
- Grid pattern overlay kaldirilsin (gereksiz karmasiklik)

#### 2.3 Tipografi
- H1: **48px desktop / 28px mobile** (mevcut 7xl fazla buyuk, 5xl'e dusur)
- Title rengi: **Beyaz** (mevcut kirmizi, beyaz daha okunur koyu bg uzerinde)
- Subtitle: **18px / 16px mobile**, `text-white/80` (korunsun)

#### 2.4 CTA Butonlari
- Primary CTA: `bg-secondary text-secondary-foreground` (sari, dikkat cekici)
  - Font: **18px, font-bold**
  - Padding: `px-8 py-4`
  - Hover: `hover:bg-secondary/90 hover:-translate-y-0.5`
  - Text: "Hemen On Kayit Yap"
- Secondary CTA: Mevcut outline stili korunsun

#### 2.5 Slide Indicator'lar
- Aktif: **Sari** (`bg-secondary`), `w-8 h-2 rounded-full`
- Inaktif: `bg-white/50 w-2 h-2`
- Mevcut yapı korunsun, sadece aktif renk degissin

#### 2.6 Navigation Arrows
- Mevcut stil korunsun, yeterince iyi

#### 2.7 Feature Badges (alt kisim)
- Korunsun, icon rengi `text-secondary` (mevcut, dogru)

#### 2.8 Bottom Wave
- Korunsun (sayfalararasi akici gecis sagliyor)

### Slide Icerigi Onerisi
```
Slide 1: "Gelecegin Yildizlari Burada Yetisiyor"
         → Cocuklarin antrenman yaptigi genis aci fotograf
Slide 2: "2026-2027 Sezonu Kayitlari Basladi"
         → Kayit donemi duyurusu
Slide 3: Basari hikayesi / turnuva sonucu
```

---

## 3. MATCHES SECTION — `components/public/matches-section.tsx`

### Mevcut Durum
- Card-based grid, countdown timer, team crests, score display
- Sponsor marquee alt kisimda
- Scrollable mobile, grid desktop

### Yapilacak Degisiklikler

#### 3.1 Section Header
- Mevcut "Fikstur" badge + baslik stili korunsun
- Badge rengi: `bg-primary/10 text-primary` (korunsun)

#### 3.2 Match Card Tasarimi
- Mevcut kart tasarimi cok iyi, buyuk degisiklik gereksiz
- Border: `border-slate-200` → hover'da `border-primary/40` (mevcut, korunsun)
- Hover: `hover:shadow-lg hover:shadow-primary/10` (mevcut, korunsun)
- Card radius: `rounded-2xl` (mevcut, korunsun)
- **Ek:** Kart ust kisimda ince kirmizi cizgi eklensin: `border-t-2 border-primary`

#### 3.3 Countdown Timer
- Mevcut CountdownDisplay iyi tasarlanmis, korunsun
- Rakam rengi: `text-slate-900` → `text-primary` yapilsin (daha dikkat cekici)

#### 3.4 Bilet/Kayit Butonu
- "Bilet" metni yerine "Detay" veya "Mac Bilgisi" kullanilsin
- Buton: `bg-primary hover:bg-primary/90` (mevcut, korunsun)

#### 3.5 Sponsor Marquee
- Mevcut marquee animasyonu korunsun
- Grayscale filtre eklensin: `filter grayscale hover:grayscale-0 transition-all`

---

## 4. NEWS SECTION — `components/public/news-section.tsx`

### Mevcut Durum
- 1 featured (buyuk) + 3 grid (kucuk) layout
- Badge, tarih, excerpt
- Hover efektleri

### Yapilacak Degisiklikler

#### 4.1 Section Arka Plan
- Mevcut `bg-slate-50` korunsun

#### 4.2 Kategori Badge'leri
- Mevcut tek "featured" badge var
- **Ek badge renkleri tanimlansin:**
  - "Duyuru" → `bg-red-100 text-red-700`
  - "Turnuva" → `bg-yellow-100 text-yellow-700`
  - "Basari" → `bg-green-100 text-green-700`
  - "Etkinlik" → `bg-blue-100 text-blue-700`
- Bu, backend'de `category` field'i gerektirir

#### 4.3 Featured Card
- Min-height: **400px** (mevcut h-80/h-96, iyi)
- Gradient overlay: `from-black/80 via-black/40 to-transparent` (mevcut, korunsun)
- Hover'da baslik rengi: `text-secondary` (sari, mevcut — korunsun)

#### 4.4 Grid Card'lar
- Mevcut horizontal layout (image sol, content sag) korunsun
- Image width: `w-36` (mevcut, korunsun)
- Hover: `group-hover:text-primary` (mevcut, korunsun)

#### 4.5 Responsive
- 2-column layout (featured + grid) korunsun
- Mobile: Tek kolon, featured uste, grid alta

#### 4.6 "Tum Haberler" Butonu
- Mevcut ok animasyonlu link korunsun
- Renk: `text-primary hover:text-primary/90` (korunsun)

---

## 5. CTA GRID SECTION — `components/public/cta-grid-section.tsx`

### Mevcut Durum
- Magaza + On Kayit ikili CTA
- Full-width, overlay + bg image
- Hover: scale + darken

### Yapilacak Degisiklikler

#### 5.1 Genel Yaklasim
- Mevcut tasarim Valencia tarzina cok uygun, minimal degisiklik yeterli

#### 5.2 Icon Badge
- Mevcut `bg-primary/90` korunsun
- On Kayit icon badge'i: `bg-secondary` (sari) yapilsin (ayrismasi icin)

#### 5.3 Alt Cizgi Accent
- Mevcut `bg-primary` → On Kayit icin `bg-secondary` yapilsin
- Hover genisleme animasyonu korunsun: `w-12 → w-24`

#### 5.4 Min-Height
- Mevcut `min-h-[400px]` korunsun

---

## 6. BANNER SECTION — `components/public/banner-section.tsx`

### Mevcut Durum
- Full-width, 300-400px height
- Image veya gradient bg
- Overlay + centered text

### Yapilacak Degisiklikler

#### 6.1 Varsayilan Gradient
- Mevcut: `from-primary via-primary/80 to-slate-900`
- **Degistir:** `from-[#8B0000] via-primary to-[#8B0000]` (koyu kirmizi gradient, daha dramatik)

#### 6.2 Tipografi
- Baslik: Mevcut stil korunsun (3xl-6xl, font-black, uppercase)
- **Ek:** Baslik altina ince sari accent cizgi eklensin: `w-20 h-1 bg-secondary mx-auto mt-4`

#### 6.3 Hover Efekti
- Mevcut overlay karalma + scale korunsun
- **Ek:** CTA text'e ok animasyonu korunsun

---

## 7. GALLERY SECTION — `components/public/gallery-section.tsx`

### Mevcut Durum
- 2 satirlik grid (3 featured + 3 secondary)
- Lightbox dialog (prev/next/close)
- Camera icon hover overlay

### Yapilacak Degisiklikler

#### 7.1 Grid Layout
- Mevcut `grid-cols-2 sm:grid-cols-3` korunsun
- Gap: `gap-3` (mevcut, korunsun — Valencia'da da sıkı grid var)

#### 7.2 Hover Overlay
- Mevcut `bg-black/20 → bg-black/50` gecisi korunsun
- **Ek:** Hover'da kirmizi ince border: `ring-2 ring-primary ring-inset` eklensin
- Camera icon korunsun

#### 7.3 Section Header
- Mevcut centered "Medya" badge + baslik korunsun
- Baslik stili: `text-4xl-6xl font-black uppercase tracking-tight` (korunsun)
- Accent cizgileri: `bg-primary/60` (korunsun)

#### 7.4 Lightbox
- Mevcut Dialog implementasyonu yeterli
- **Ek:** Counter gosterilsin: "3 / 12" seklinde (ust orta)

#### 7.5 CTA Butonu
- "Tumunu Gor" butonu korunsun
- Stil: outline → `bg-primary text-white` yapilsin (daha goze carpar)

---

## 8. SPONSORS SECTION — `components/public/sponsors-section.tsx`

### Mevcut Durum
- 3 tier (main/official/partner), boyuta gore logo
- Tier separator cizgileri
- Opacity hover efekti

### Yapilacak Degisiklikler

#### 8.1 Grayscale Efekti
- Mevcut `opacity-80 → opacity-100` hover efekti var
- **Ek:** `filter grayscale` → hover'da `grayscale-0` gecisi eklensin
- Daha profesyonel ve Valencia tarzinda gorunur

#### 8.2 Section Padding
- Mevcut `py-20` → `py-16` (biraz kisalt, sponsors alani cok yer kaplamamali)

#### 8.3 Tier Etiketleri
- Mevcut separator + label stili korunsun
- Label: `text-[11px] font-bold uppercase tracking-[0.25em]` (mevcut, korunsun)

---

## 9. FOOTER — `components/public/public-footer.tsx`

### Mevcut Durum
- Features bar (kargo, guvenlik, taksit, destek)
- 4-column grid (brand, quick links, magaza, iletisim)
- Legal documents + copyright
- Acik tema (`bg-slate-50`)

### Yapilacak Degisiklikler

#### 9.1 Arka Plan
- **Koyu tema:** `bg-slate-900 text-white` (Valencia tarzinda koyu footer)
- Alt bar: `bg-slate-950`
- Link renkleri: `text-slate-400 hover:text-secondary` (hover'da sari)

#### 9.2 Features Bar
- Koyu tema uyumu: Icon container'lar `bg-white/10` yapilsin
- Text: `text-white`, alt text: `text-slate-400`

#### 9.3 Sosyal Medya
- Icon boyutu: **24px** (mevcut 20px, biraz buyut)
- Container: `w-10 h-10 rounded-lg` (mevcut, korunsun)
- Hover renkleri korunsun (platform-specific renkler)
- Koyu bg uyumu: Default state `bg-slate-800` (mevcut `bg-slate-200`'den degistir)

#### 9.4 Quick Links
- Mevcut chevron animasyonu korunsun
- Hover rengi: `hover:text-secondary` (sari)

#### 9.5 Copyright Bar
- COSMOS linki korunsun
- Garanti BBVA logosu korunsun
- Text: `text-slate-500`

#### 9.6 WhatsApp Floating Button
- Mevcut `whatsapp-float.tsx` dosyasi var (ayri component)
- **Korunsun:** 56px circle, yesil (#25D366), z-index 999
- Sag alt kose, her sayfada gorunur

---

## 10. RENK PALETİ (MEVCUT THEME + REVIZYONLAR)

### Mevcut globals.css Token'lari (KORUNACAK)
| Token | Deger | Kullanim |
|-------|-------|----------|
| `--primary` | `oklch(0.50 0.22 25)` | Ana kirmizi — header, butonlar, vurgular |
| `--primary-foreground` | `oklch(0.985 0 0)` | Beyaz — kirmizi uzerindeki text |
| `--secondary` | `oklch(0.88 0.12 85)` | Sari/altin — CTA butonlar, hover accent |
| `--secondary-foreground` | `oklch(0.25 0.06 85)` | Koyu — sari uzerindeki text |

### Ek Utility Renkleri (Tailwind class olarak)
| Kullanim | Tailwind Class | Aciklama |
|----------|---------------|----------|
| Koyu kirmizi bg | `bg-[#8B0000]` | Footer, banner gradient |
| Koyu section bg | `bg-slate-900` | Footer, koyu bolumlerde |
| En koyu bg | `bg-slate-950` veya `bg-[#0f172a]` | Footer alt bar |
| Acik gri bg | `bg-slate-50` | Alternatif section bg |
| Success | `text-green-600` | Kontenjan durumu |
| Warning | `text-amber-500` | Azalan kontenjan |
| Danger accent | `text-red-500` | Son birkac kisi |

### WCAG Kontrast Kurallari
- Kirmizi text beyaz bg uzerinde: OK (kontrast 7:1+)
- Beyaz text kirmizi bg uzerinde: OK (kontrast 7:1+)
- Sari text koyu bg uzerinde: DIKKAT — `secondary-foreground` (koyu) kullan
- Sari buton uzerinde koyu text kullan, beyaz text KULLANMA

---

## 11. TİPOGRAFİ

### Font Ailesi
- **Mevcut:** Geist Sans (--font-geist-sans) — korunsun
- Geist Sans modern, temiz ve sportif bir sans-serif. Montserrat'a gecis gereksiz

### Olcek Tablosu
| Element | Desktop | Mobile | Weight | Class |
|---------|---------|--------|--------|-------|
| Hero H1 | 48px | 28px | 800 | `text-5xl md:text-5xl font-extrabold` |
| Section H2 | 36px | 24px | 900 | `text-2xl md:text-4xl font-black` |
| Card H3 | 24px | 20px | 700 | `text-xl md:text-2xl font-bold` |
| Body | 16px | 16px | 400 | `text-base` |
| Small/Meta | 14px | 12px | 500 | `text-sm md:text-xs font-medium` |
| Nav Link | 14px | 14px | 600 | `text-sm font-semibold uppercase tracking-wider` |
| Badge | 12px | 11px | 700 | `text-xs font-bold uppercase tracking-widest` |

### Line Height
- Body: `leading-relaxed` (1.625)
- Headings: `leading-tight` (1.25)

---

## 12. SPACING SİSTEMİ

- Base unit: **8px** (Tailwind'in varsayilan 4px grid'i ile uyumlu)
- Section padding: `py-20` desktop (80px) / `py-12` mobile (48px)
- Card padding: `p-6` (24px)
- Grid gap: `gap-6` desktop (24px) / `gap-4` mobile (16px)
- Container: `container mx-auto px-4` (max-width inherent, padding 16px)

---

## 13. ANİMASYONLAR

### Mevcut (globals.css'de tanimli, KORUNACAK)
- `animate-fade-in-down` — Badge giris
- `animate-fade-in-up` — Title/subtitle giris
- `animate-fade-in` — Feature badges giris
- `animate-marquee` — Sponsor marquee
- `animate-gradient` — Hero bg animasyonu

### Eklenmesi Gerekenler
```css
/* Scroll reveal - AOS benzeri */
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-reveal-up {
  animation: reveal-up 0.6s ease-out forwards;
}

/* Counter sayma animasyonu (istatistik section) */
/* JS ile yapilacak — useCountUp hook */

/* CTA pulse (dikkat cekici ama abartisiz) */
@keyframes subtle-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(255, 215, 0, 0); }
}
.animate-subtle-pulse {
  animation: subtle-pulse 2s ease-in-out infinite;
}
```

### Genel Ilke
- **Conservative, profesyonel motion** — Valencia'nin yaklasimi dogru
- Tum transition'lar: `duration-300` (varsayilan), carousel icin `duration-1000`
- Hover efektleri: `hover:-translate-y-0.5` veya `hover:-translate-y-1` (kucuk kayma)
- Scale efektleri: Max `hover:scale-105` (abartma)

---

## 14. RESPONSIVE BREAKPOINTS

| Breakpoint | Genislik | Tailwind Prefix |
|------------|----------|-----------------|
| Mobile | < 768px | (varsayilan) |
| Tablet | 768px+ | `md:` |
| Desktop | 1024px+ | `lg:` |
| Large | 1440px+ | `xl:` / `2xl:` |

### Kritik Mobile Kararlari
- Hamburger menu → Full-screen overlay
- Hero height: **50vh** (fazla scroll engellenmeli)
- Card'lar: Horizontal scroll veya tek kolon
- WhatsApp floating butonu: Her zaman gorunur
- **Sticky bottom bar:** "On Kayit" + "Ara" butonlari (yeni, eklenecek)
- Font olcekleri kuculecek (tablo yukarda)

---

## 15. COMPONENT BAZINDA ONCELIK SIRASI

Implementasyon icin onerilen sira:

1. **globals.css** — Yeni animasyon keyframe'leri eklenmesi
2. **public-header.tsx** — Uppercase nav, CTA butonu, yukseklik ayari
3. **hero-slider.tsx** — Sol-alt alignment, boyut kucultme, sari CTA
4. **public-footer.tsx** — Koyu tema gecisi (en buyuk gorsel degisiklik)
5. **banner-section.tsx** — Gradient ve accent cizgi
6. **gallery-section.tsx** — Ring hover + lightbox counter
7. **sponsors-section.tsx** — Grayscale efekti
8. **matches-section.tsx** — Kart ust border + countdown rengi
9. **news-section.tsx** — Kategori badge renkleri
10. **cta-grid-section.tsx** — Icon badge renk ayrimi

---

## 16. YAPILMAMASI GEREKENLER (Anti-patterns)

- Sari text koyu bg uzerinde KULLANILMAMALI (kontrast yetersiz) — sari sadece buton bg veya accent olarak
- Hero'da 90vh+ yukseklik KULLANILMAMALI — veliler scroll etmek ister
- Asiri animasyon EKLENMEMELI — max 2-3 farkli animasyon tipi yeterli
- Gradient text KULLANILMAMALI — okunabilirlik sorunu
- Her section'a farkli bg rengi VERILMEMELI — beyaz ve slate-50 alternatifi yeterli
- Nav'da icon KULLANILMAMALI (desktop) — text-only daha temiz

---

## 17. ISTATISTIK SECTION (YENİ — OPSİYONEL)

Site-analytics brief'inde bahsedilen istatistik alani icin yeni bir section onerisi:

### Icerme Yeri
- Hero ile Matches arasinda veya Matches altinda

### Icerik
- "150+ Aktif Ogrenci"
- "12 Profesyonel Antrenor"
- "3 Modern Saha"
- "15 Yillik Deneyim"

### Tasarim
- Arka plan: `bg-slate-900` (koyu) veya `bg-primary` (kirmizi)
- 4 kolon grid: her biri buyuk sayi + aciklama
- Sayi: `text-5xl font-black text-secondary` (sari)
- Aciklama: `text-sm text-white/80 uppercase tracking-wider`
- Animasyon: Scroll'a girince 0'dan sayma (useCountUp hook)

Bu section opsiyonel, implementasyon zamani karar verilecek.

---

## SONUC

Bu spesifikasyon, mevcut component'larin Valencia CF estetigine uygun revizyonunu tanimlar. Temel yaklasim:

1. **Renk:** Mevcut kirmizi-sari tema KORUNSUN, kullanim noktalari rafine edilsin
2. **Layout:** Buyuk degisiklik yok, mevcut yapilar yeterli
3. **Tipografi:** Uppercase nav, daha kontrollü boyutlar
4. **Footer:** En buyuk degisiklik — koyu temaya gecis
5. **Hero:** Boyut kucultme, sol-alt alignment, sari CTA
6. **Detaylar:** Grayscale sponsorlar, ring hover galeri, accent cizgiler

Minimal degisiklikle maksimum profesyonel etki hedefleniyor.
