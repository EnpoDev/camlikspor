# Futbol Okulu Yönetim Sistemi - Güvenlik & Kod Kalitesi Denetim Raporu

**Tarih:** 18 Mart 2026
**Denetçi:** Güvenlik Mühendisi
**Sistem:** Futbol Okulu Yönetim Sistemi (Next.js + Prisma + SQLite)

---

## ÖZET

Sistem temel güvenlik pratiğini takip etse de, **önemli eksiklikler** bulunmuştur. Özellikle **PII (kişisel tanımlama bilgisi) verileri şifrelenmemekte** ve **denetim günlükleri eksik**tir.

**Kritik Bulgu Sayısı:** 4
**Yüksek Bulgu Sayısı:** 6
**Orta Bulgu Sayısı:** 5
**Düşük Bulgu Sayısı:** 3

---

## 1. AUTH & SESSION GÜVENLİĞİ

### ✅ GÜÇLÜ YÖNLER

- **JWT + Credentials Provider:** NextAuth.js v5 beta ile modern auth yapısı
- **Bcrypt Hashing:** Şifreler bcryptjs ile güvenli şekilde hash'leniyor (salt=12)
- **Role-Based Access Control:** ROLE_PERMISSIONS ile granular izin sistemi
- **Sub-Dealer İzolasyonu:** Sub-dealer admin'lerin kısıtlı izinleri filtreleniyor
- **Session Strategy:** JWT tabanlı session, CSRF-safe

### ❌ GÜVENLIK AÇIKLIKLARI

#### **1. Zayıf Parola Politikası (KRİTİK)**
- **Dosya:** `lib/auth.ts` (satır 21-24)
- **Problem:** Student ve Parent kullanıcıları **minimum 1 karakter** şifre ile girebiliyor
  ```typescript
  const studentLoginSchema = z.object({
    password: z.string().min(1),  // ❌ ÇOK ZAYIF
  });
  ```
- **Etkisi:** Brute-force saldırısı riski yüksek
- **Çözüm:** Minimum 8 karakter, uppercase/lowercase/digit kombinasyonu zorunlu kılınmalı

#### **2. Session Timeout Yok (YÜKSEK)**
- **Dosya:** `lib/auth.config.ts`
- **Problem:** JWT tokeninde `maxAge` veya `sessionTimeout` ayarı yok
- **Etkisi:** Oturumlar hiç kapanmayabiliyor, session hijacking riski
- **Çözüm:**
  ```typescript
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60  // 24 saat
  }
  ```

#### **3. Parola Değişimi Güvenliği (YÜKSEK)**
- **Dosya:** `app/api/user/password/route.ts` (satır 12-75)
- **Problem:**
  - API route'unun **auth kontrolü yok**
  - Tek bir password payload'ı ile multiple attempts yapılabilir
  - Rate limiting yok
- **Etkisi:** Brute-force parola kırma saldırısı
- **Çözüm:** Rate limiting ve auth middleware eklenmeli

#### **4. "mustChangePassword" Flag'i Eksik Uygulanması (ORTA)**
- **Dosya:** `lib/auth.ts` (satır 162, 216) & `lib/auth.config.ts` (satır 52)
- **Problem:** Temporary password ile login yapanlar zorla parola değiştirmeye yönlendirilmiyor
- **Etkisi:** Temporary password ile hesap kullanılmaya devam edebiliyor
- **Çözüm:** Middleware'de `mustChangePassword` kontrolü gerekli

---

## 2. SERVER ACTIONS GÜVENLİĞİ

### ✅ GÜÇLÜ YÖNLER

- **Zod Validation:** Input validation çoğu action'da Zod ile yapılıyor
- **Multi-tenant Filtering:** `session.user.dealerId` çoğunlukla kontrol ediliyor
- **Authorization Checks:** Kimliklendirme başında kontrol ediliyor

### ❌ GÜVENLIK AÇIKLIKLARI

#### **5. Inconsistent DealerId Filtering (KRİTİK)**
- **Dosya:** `lib/actions/invoices.ts` (satır 76-82)
- **Problem:**
  ```typescript
  // SUPER_ADMIN için dealerId yok, tüm invoices'e erişebiliyor
  if (!dealerId && session.user.role !== UserRole.SUPER_ADMIN) {
    return { success: false, message: "Yetkisiz işlem" };
  }
  ```
- **Etkisi:** SUPER_ADMIN herkesin faturasına erişebiliyor
- **Çözüm:** SUPER_ADMIN için explicit dealer filtering gerekli

#### **6. Eksik Multi-Tenant Checks (YÜKSEK)**
- **Dosya:** `lib/actions/` (35 dosya içinde sadece 8'i `dealerId` kontrol ediyor)
- **Problem:** 27 action dosyası dealerId filtrelemesi yapmıyor
- **Etkisi:** Horizontal privilege escalation riski
- **Çözüm:** Tüm actions'da `dealerId` validation eklenmeli

#### **7. Student Yazarken Parent Bilgileri Şifrelenmemiş (KRİTİK)**
- **Dosya:** `lib/actions/students.ts` (satır 106-121)
- **Problem:**
  ```typescript
  const student = await prisma.student.create({
    data: {
      tcKimlikNo: validatedFields.data.tcKimlikNo || null,  // ❌ plain text
      phone: validatedFields.data.phone || null,            // ❌ plain text
      parentTcKimlik: validatedFields.data.parentTcKimlik || null, // ❌ plain text
      // ...
    }
  });
  ```
- **Etkisi:** KVKK/GDPR ihlali, veri hırsızlığı riski
- **Çözüm:** Encryption functions var ama kullanılmıyor!
  ```typescript
  import { encrypt } from '@/lib/utils/encryption';
  tcKimlikNo: validatedFields.data.tcKimlikNo ? encrypt(validatedFields.data.tcKimlikNo) : null
  ```

---

## 3. API ROUTES GÜVENLİĞİ

### ✅ GÜÇLÜ YÖNLER

- **File Upload Validation:** MIME type ve size kontrolü var
- **Authentication:** Bazı route'lar auth kontrol ediyor

### ❌ GÜVENLIK AÇIKLIKLARI

#### **8. Public Payment Inquiry - PII Data Exposure (KRİTİK)**
- **Dosya:** `app/api/public/payment-inquiry/route.ts` (satır 5-134)
- **Problem:**
  ```typescript
  // Kimlik doğrulama YOKSUN
  export async function POST(request: NextRequest) {
    // Auth kontrolü yok! ❌
    const { query } = body;
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { tcKimlikNo: query.toString().trim() },  // ❌ Expose
          { phone: query.toString().trim() },
        ],
      },
    });
  ```
- **Etkisi:**
  - TC Kimlik No ile öğrenci bilgileri sorgulanabiliyor (public)
  - Student ID leak'i
  - Ödeme durumunun bilinebilmesi
- **Çözüm:**
  - Rate limiting eklenmeli (10 requests/hour)
  - Zaman aşımı sonrası TC Kimlik maskelenmeli
  - Logging/auditing eklenmelicountermeasure

#### **9. Rate Limiting Tamamen Yok (YÜKSEK)**
- **Dosya:** Tüm API routes (`app/api/**`)
- **Problem:** Hiçbir API route'unda rate limiting yok
- **Etkisi:** Brute-force, DDoS saldırıları
- **Çözüm:** Middleware'de rate limiter eklenmel

#### **10. File Upload Path Traversal Riski (ORTA)**
- **Dosya:** `app/api/upload/route.ts` (satır 44-46)
- **Problem:**
  ```typescript
  const safeFolder = folder.replace(/[^a-zA-Z0-9-_]/g, "");  // İyi
  const filePath = path.join(uploadDir, fileName);            // Güvenli
  ```
- **Durum:** Aslında güvenli ama hardened olabilir
- **Çözüm:** Path traversal için `path.normalize()` ekle

#### **11. Şifre Değişimi API'sinde No Authentication (YÜKSEK)**
- **Dosya:** `app/api/parent/change-password/route.ts` & `app/api/user/password/route.ts`
- **Problem:** PUT request'te auth kontrolü var ama rate limiting yok
- **Etkisi:** Brute-force parola kırma
- **Çözüm:** Maksimum 5 deneme/15 dakika rate limiting

---

## 4. ENCRYPTİON & PII KORUNMASI

### ✅ GÜÇLÜ YÖNLER

- **AES-256-GCM Implementation:** `lib/utils/encryption.ts` iyi yazılmış
- **Random IV:** Her encryption için yeni IV kullanılıyor
- **Auth Tag:** GCM auth tag ile integrity korunuyor

### ❌ GÜVENLIK AÇIKLIKLARI

#### **12. PII Verileri Şifrelenmiyor (KRİTİK)**
- **Dosya:** Tüm action files
- **Problem:** Encryption fonksiyonları var ama **hiç kullanılmıyor!**
  - TC Kimlik No ❌
  - IBAN/Banka Hesabı ❌
  - Telefon ❌
  - Email ❌
- **Etkisi:** KVKK/GDPR Madde 32 ihlali
- **Çözüm:** Tüm PII fields için encrypt/decrypt wrapper oluştur:
  ```typescript
  // lib/utils/pii-encryption.ts
  export function encryptPII(plaintext: string | null, field: string) {
    if (!plaintext) return null;
    return encrypt(plaintext);
  }

  export function decryptPII(encrypted: string | null) {
    if (!encrypted) return null;
    return decrypt(encrypted);
  }
  ```

#### **13. Encryption Key Management (ORTA)**
- **Dosya:** `lib/utils/encryption.ts` (satır 5-11)
- **Problem:**
  ```typescript
  function getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error("ENCRYPTION_KEY environment variable is not set");
    return Buffer.from(key, "hex");
  }
  ```
- **Etkisi:** Key rotation mekanizması yok, key leak riski
- **Çözüm:**
  - Key versioning ekle
  - Periodically rotate keys
  - Hardware security module (HSM) kullanı

---

## 5. AUDIT & LOGGING

### ✅ GÜÇLÜ YÖNLER

- **AuditLog Schema:** Veritabanında audit log modeli var
- **PII Masking:** `lib/logger.ts`'de PII masking yapılıyor
- **Structured Logging:** Pino logger kullanılıyor

### ❌ GÜVENLIK AÇIKLIKLARI

#### **14. Audit Logging Eksik (YÜKSEK)**
- **Dosya:** `lib/actions/` (35 dosya, sadece 1'de `logAudit` kullanılıyor!)
- **Problem:**
  ```typescript
  // pre-registration.ts sadece logAudit'i kullanan dosya
  // students.ts, trainers.ts, users.ts, invoices.ts v.s. ❌
  ```
- **Etkisi:** Siber olayları takip edilemiyor, compliance ihlali
- **Çözüm:** Tüm CREATE/UPDATE/DELETE'lerde logAudit() çağır

#### **15. Login Audit Logging (ORTA)**
- **Dosya:** `lib/auth.ts` (satır 84-88)
- **Problem:** Successful login'de `lastLoginAt` güncellenyor ama audit log yok
- **Etkisi:** Unauthorized access tespiti edilemiyor
- **Çözüm:**
  ```typescript
  // After password match succeeds:
  logAudit({
    actor: parsed.data.email,
    action: "LOGIN",
    entity: "User",
    entityId: user.id,
    dealerId: user.dealerId,
    status: "SUCCESS"
  });
  ```

#### **16. Failed Login Attempts Logging (ORTA)**
- **Dosya:** `lib/auth.ts` (satır 76, 82, 140)
- **Problem:** Failed login'lerde audit log yok
- **Etkisi:** Brute-force attacks tespil edilemiyor
- **Çözüm:** Failed attempts da log'lanmalı

---

## 6. MULTI-TENANT İZOLASYON

### ✅ GÜÇLÜ YÖNLER

- **Sub-Dealer Permissions:** Kısıtlı izin sistemi var
- **DealerId Token:** JWT token'da dealerId var

### ❌ GÜVENLIK AÇIKLIKLARI

#### **17. Incomplete DealerId Validation in Update Operations (YÜKSEK)**
- **Dosya:** `lib/actions/users.ts` (satır 85-99)
- **Problem:**
  ```typescript
  // DEALER_ADMIN sub-dealer assign edebiliyor
  // Ama başka dealer'a user assign etmeye karşı sadece check yapılıyor
  // READ operations kontrol yok!
  ```
- **Çözüm:** Read operations'da da dealerId filter'leme yapılmalı

---

## 7. GENEL KOD KALİTESİ

### ✅ GÜÇLÜ YÖNLER

- **TypeScript:** Tiped project
- **Zod Validation:** Schema-based validation
- **Error Handling:** Try-catch blocks çoğumda var

### ❌ KOD KALİTESİ AÇIKLIKLARI

#### **18. Inconsistent Error Handling (ORTA)**
- **Problem:** Bazen `console.error`, bazen silent fail
- **Çözüm:** Centralized error handling middleware

#### **19. Magic Strings (DÜŞÜK)**
- **Problem:** Hardcoded role/permission strings
- **Çözüm:** Enum kullan (kısmen yapılmış)

#### **20. Type Safety Issues (DÜŞÜK)**
- **Dosya:** `lib/actions/payments.ts` vb.
- **Problem:** `any` type kullanımlar
- **Çözüm:** `unknown` → type guard'lı approach

---

## 8. MIDDLEWARE GÜVENLİĞİ

### ✅ GÜÇLÜ YÖNLER

- **Security Headers:** X-Frame-Options, X-Content-Type-Options, XSS-Protection
- **Locale Matching:** i18n support
- **Protected Routes:** Dashboard routes protected

### ❌ AÇIKLIKLAR

#### **21. CSP (Content Security Policy) Yok (ORTA)**
- **Çözüm:** `middleware.ts`'e CSP header'ı ekle
  ```typescript
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'..."
  ```

#### **22. HSTS Missing (ORTA)**
- **Çözüm:** `Strict-Transport-Security: max-age=31536000; includeSubDomains`

---

## BULGULARIN ÖZETLENMİŞ LİSTESİ

| Sıra | Başlık | Kritiklik | Dosya |
|------|--------|-----------|-------|
| 1 | Zayıf Parola Politikası (Min 1 char) | **KRİTİK** | lib/auth.ts |
| 2 | Session Timeout Yok | **YÜKSEK** | lib/auth.config.ts |
| 3 | Parola API'sinde Rate Limiting Yok | **YÜKSEK** | app/api/user/password/route.ts |
| 4 | Inconsistent DealerId Filtering | **KRİTİK** | lib/actions/ (35 file) |
| 5 | PII Şifresi Tamamen Yok (TC, IBAN, vb) | **KRİTİK** | lib/actions/students.ts |
| 6 | Public Payment Inquiry - Kimlik Kontrolü Yok | **KRİTİK** | app/api/public/payment-inquiry/route.ts |
| 7 | Rate Limiting Yok (Tüm API'ler) | **YÜKSEK** | app/api/ |
| 8 | Audit Logging Eksik (27/35 action) | **YÜKSEK** | lib/actions/ |
| 9 | Login/Failed Login Audit Yok | **ORTA** | lib/auth.ts |
| 10 | DealerId Validation Eksik (Some Reads) | **ORTA** | lib/actions/ |
| 11 | File Upload Path Traversal | **ORTA** | app/api/upload/route.ts |
| 12 | CSP Header Yok | **ORTA** | middleware.ts |
| 13 | HSTS Header Yok | **ORTA** | middleware.ts |
| 14 | Encryption Key Rotation Yok | **ORTA** | lib/utils/encryption.ts |
| 15 | mustChangePassword Uygulanmıyor | **ORTA** | middleware.ts |
| 16 | Inconsistent Error Handling | **DÜŞÜK** | lib/actions/ |
| 17 | Magic Strings | **DÜŞÜK** | lib/types.ts |
| 18 | Type Safety (`any`) | **DÜŞÜK** | Multiple files |

---

## ÖNERİLER & REMEDIASYON PLANLAMASI

### HEMEN YAPILABİLECEKLER (1-2 gün)

1. **Password Policy Upgrade**
   ```typescript
   // lib/auth.ts satır 21-24 güncelle
   const loginSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8)  // Minimum 8
       .refine(pwd => /[A-Z]/.test(pwd), "Büyük harf gerekli")
       .refine(pwd => /[a-z]/.test(pwd), "Küçük harf gerekli")
       .refine(pwd => /[0-9]/.test(pwd), "Rakam gerekli")
   });
   ```

2. **Session Timeout Ekle**
   ```typescript
   // lib/auth.config.ts satır 10
   session: { strategy: "jwt", maxAge: 24 * 60 * 60 }
   ```

3. **Rate Limiting Middleware**
   ```typescript
   // lib/middleware/rate-limit.ts
   import { Ratelimit } from "@upstash/ratelimit";
   ```

4. **Security Headers Ekle**
   ```typescript
   // middleware.ts'e ekle
   "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
   "Content-Security-Policy": "..."
   ```

### KISA VADEDE (1 hafta)

5. **Audit Logging Implement**
   - Tüm actions'da `logAudit()` ekle
   - Login/logout events log'la
   - Failed attempts log'la

6. **PII Encryption Wrapper**
   ```typescript
   // lib/utils/pii-encryption.ts
   export function encryptField(value: string | null, field: string) {
     if (!value) return null;
     return encrypt(value);
   }
   ```

   Tüm create/update'lerde kullan:
   ```typescript
   tcKimlikNo: encryptField(data.tcKimlikNo, "tcKimlik")
   ```

7. **Public API Güvenliği**
   - `/public/payment-inquiry` rate limit'le (10/hour)
   - Başarısız sorguları log'la
   - CAPTCHA'ya al

### ORTA VADEDE (2-4 hafta)

8. **Comprehensive Multi-Tenant Audit**
   - Tüm queries'de `dealerId` validation
   - Integration tests yaz
   - RBAC review

9. **Encryption Key Management**
   - Key versioning implement
   - Key rotation strategy
   - Backup/restore process

10. **Security Testing**
    - OWASP Top 10 penetration test
    - SQL injection scanning
    - XSS audit

---

## COMPLIANCE UYGUNLUĞU

| Standart | Durum | Açıklama |
|----------|-------|---------|
| KVKK (Türkiye) | ❌ | PII encryption yok, audit insufficient |
| GDPR | ❌ | Encryption & data retention policies eksik |
| OWASP Top 10 | ⚠️ | A01 (Broken Auth), A03 (Injection) riski |
| NIST Cybersecurity Framework | ⚠️ | Identify & Protect tamamdır, Detect eksik |

---

## SONUÇ

Sistem **temel güvenlik pratiğini** takip ediyor fakat **3 kritik açıklık** vardır:

1. ❌ **PII verileri şifrelenmemiş** (KVKK ihlali)
2. ❌ **Audit logging eksik** (27/35 action dosyası)
3. ❌ **Public API'lerde kimlik kontrolü yok** (Data leak riski)

**Risk Seviyesi: YÜKSEK** 🔴

Kritik bulgular **2 hafta** içinde düzeltilmeli. Şu anda production'a geçebilir ama yapılan bulgular **hukuki sorumluluk** doğuracaktır.

---

**Rapor Onayı:** Bu rapor güvenlik denetimi kapsamında hazırlanmıştır. Tespit edilen tüm açıklıklara yönelik remediasyon önerileri sunulmuştur.

