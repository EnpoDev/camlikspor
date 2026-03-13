import { notFound } from "next/navigation";
import { Metadata } from "next";

interface LegalPageProps {
  params: Promise<{
    locale: string;
    dealerSlug: string;
    slug: string;
  }>;
}

// Legal documents content
const legalDocuments: Record<string, { title: string; content: string }> = {
  "kvkk": {
    title: "Kişisel Verilerin Korunması ve İşlenmesi Politikası (K.V.K.K.)",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>Kişisel Verilerin Korunması ve İşlenmesi Politikası</h1>

        <h2>1. Giriş</h2>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Çamlık Spor Kulübü
          olarak kişisel verilerinizin güvenliğine önem veriyor ve bu politika ile kişisel verilerinizin
          nasıl toplandığı, işlendiği, saklandığı ve korunduğu hakkında sizleri bilgilendiriyoruz.
        </p>

        <h2>2. Veri Sorumlusu</h2>
        <p>
          Kişisel verileriniz, veri sorumlusu sıfatıyla Çamlık Spor Kulübü tarafından aşağıda
          açıklanan kapsamda işlenebilecektir.
        </p>

        <h2>3. İşlenen Kişisel Veriler</h2>
        <ul>
          <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası, doğum tarihi</li>
          <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi, adres</li>
          <li><strong>Sağlık Bilgileri:</strong> Sağlık raporu, alerji bilgileri</li>
          <li><strong>Görsel/İşitsel Bilgiler:</strong> Fotoğraf, video kayıtları</li>
          <li><strong>Finansal Bilgiler:</strong> Ödeme ve fatura bilgileri</li>
        </ul>

        <h2>4. Kişisel Verilerin İşlenme Amaçları</h2>
        <ul>
          <li>Spor eğitimi hizmetlerinin sunulması</li>
          <li>Üyelik işlemlerinin yürütülmesi</li>
          <li>İletişim ve bilgilendirme</li>
          <li>Güvenlik ve sağlık önlemlerinin alınması</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Ödeme ve fatura işlemlerinin gerçekleştirilmesi</li>
        </ul>

        <h2>5. Kişisel Verilerin Aktarılması</h2>
        <p>
          Toplanan kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi doğrultusunda
          iş ortaklarımıza, hizmet sağlayıcılarımıza, yetkili kamu kurum ve kuruluşlarına, KVKK'nın
          8. ve 9. maddelerinde belirtilen şartlar çerçevesinde aktarılabilecektir.
        </p>

        <h2>6. Kişisel Veri Sahibinin Hakları</h2>
        <p>KVKK'nın 11. maddesi uyarınca, veri sahipleri olarak aşağıdaki haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Kişisel verilerin yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
          <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
          <li>Kişisel verilerin düzeltilmesi, silinmesi veya yok edilmesi halinde bu işlemlerin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
        </ul>

        <h2>7. İletişim</h2>
        <p>
          Kişisel verileriniz ile ilgili sorularınız için <strong>info@camliksk.com</strong>
          adresinden bizimle iletişime geçebilirsiniz.
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Son Güncelleme: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  },
  "gizlilik-politikasi": {
    title: "Gizlilik Politikası",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>Gizlilik Politikası</h1>

        <h2>1. Genel Bilgiler</h2>
        <p>
          Çamlık Spor Kulübü olarak gizliliğinize saygı duyuyor ve kişisel bilgilerinizi korumayı
          taahhüt ediyoruz. Bu Gizlilik Politikası, web sitemizi ziyaret ettiğinizde, hizmetlerimizi
          kullandığınızda veya kulübümüze üye olduğunuzda topladığımız bilgilerin nasıl kullanıldığını
          açıklamaktadır.
        </p>

        <h2>2. Topladığımız Bilgiler</h2>
        <h3>2.1. Kişisel Bilgiler</h3>
        <ul>
          <li>Ad, soyad</li>
          <li>Doğum tarihi</li>
          <li>T.C. Kimlik Numarası</li>
          <li>İletişim bilgileri (telefon, e-posta, adres)</li>
          <li>Veli/vasi bilgileri</li>
        </ul>

        <h3>2.2. Sağlık Bilgileri</h3>
        <ul>
          <li>Sağlık raporu</li>
          <li>Alerji ve kronik hastalık bilgileri</li>
          <li>Acil durum iletişim bilgileri</li>
        </ul>

        <h3>2.3. Kullanım Verileri</h3>
        <ul>
          <li>IP adresi</li>
          <li>Tarayıcı türü ve versiyonu</li>
          <li>Ziyaret edilen sayfalar</li>
          <li>Ziyaret tarihi ve saati</li>
        </ul>

        <h2>3. Bilgilerin Kullanım Amaçları</h2>
        <ul>
          <li>Üyelik ve kayıt işlemlerinin yürütülmesi</li>
          <li>Antrenman programlarının düzenlenmesi</li>
          <li>Sağlık ve güvenlik önlemlerinin alınması</li>
          <li>İletişim ve bilgilendirme</li>
          <li>Ödeme işlemlerinin gerçekleştirilmesi</li>
          <li>Hizmet kalitesinin artırılması</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
        </ul>

        <h2>4. Bilgilerin Paylaşımı</h2>
        <p>
          Kişisel bilgileriniz, açık rızanız olmaksızın üçüncü şahıslarla paylaşılmamaktadır.
          Ancak aşağıdaki durumlarda bilgileriniz paylaşılabilir:
        </p>
        <ul>
          <li>Yasal zorunluluklar</li>
          <li>Yetkili kamu kurum ve kuruluşlarının talebi</li>
          <li>Hizmet sağlayıcılar (ödeme sistemleri, SMS hizmetleri vb.)</li>
          <li>İş ortaklarımız (turnuva organizasyonları, federasyonlar vb.)</li>
        </ul>

        <h2>5. Veri Güvenliği</h2>
        <p>
          Kişisel bilgilerinizin güvenliğini sağlamak için gerekli teknik ve idari tedbirleri alıyoruz:
        </p>
        <ul>
          <li>SSL sertifikası ile şifreli veri iletimi</li>
          <li>Güvenli sunucu altyapısı</li>
          <li>Erişim kontrolü ve yetkilendirme sistemi</li>
          <li>Düzenli güvenlik denetimleri</li>
          <li>Personel eğitimleri</li>
        </ul>

        <h2>6. Çerezler (Cookies)</h2>
        <p>
          Web sitemizde kullanıcı deneyimini iyileştirmek için çerezler kullanılmaktadır.
          Detaylı bilgi için lütfen Çerez Politikamızı inceleyiniz.
        </p>

        <h2>7. Haklarınız</h2>
        <p>
          KVKK kapsamında aşağıdaki haklara sahipsiniz:
        </p>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>Kişisel verilerinize erişim talep etme</li>
          <li>Kişisel verilerinizin düzeltilmesini veya silinmesini isteme</li>
          <li>Kişisel verilerinizin işlenmesine itiraz etme</li>
        </ul>

        <h2>8. Çocukların Gizliliği</h2>
        <p>
          18 yaş altı bireylerin kişisel verileri, veli/vasi onayı ile toplanmakta ve işlenmektedir.
          Veliler, çocuklarının kişisel verileri üzerinde tam hakka sahiptir.
        </p>

        <h2>9. Değişiklikler</h2>
        <p>
          Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler olduğunda
          sizleri bilgilendireceğiz.
        </p>

        <h2>10. İletişim</h2>
        <p>
          Gizlilik politikamız hakkında sorularınız için:<br />
          E-posta: <strong>info@camliksk.com</strong><br />
          Telefon: <strong>0532 241 24 31</strong>
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Son Güncelleme: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  },
  "cerez-politikasi": {
    title: "Çerez Politikası",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>Çerez Politikası</h1>

        <h2>1. Çerez Nedir?</h2>
        <p>
          Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcılar aracılığıyla cihazınıza
          veya ağ sunucusuna depolanan küçük metin dosyalarıdır. Web sitemizi ziyaret ettiğinizde,
          kişisel verileriniz çerezler vasıtasıyla işlenebilmektedir.
        </p>

        <h2>2. Çerez Türleri</h2>

        <h3>2.1. Zorunlu Çerezler</h3>
        <p>
          Web sitesinin düzgün çalışması için gerekli olan çerezlerdir. Bu çerezler olmadan
          web sitesi düzgün çalışmayacaktır.
        </p>
        <ul>
          <li><strong>Oturum Çerezleri:</strong> Giriş yapmış kullanıcıların oturum bilgilerini saklar</li>
          <li><strong>Güvenlik Çerezleri:</strong> Güvenlik önlemlerini destekler</li>
          <li><strong>Yük Dengeleme:</strong> Sunucu yükünü dağıtmak için kullanılır</li>
        </ul>

        <h3>2.2. İşlevsel Çerezler</h3>
        <p>
          Web sitesinde daha gelişmiş özellikler ve kişiselleştirme sunan çerezlerdir.
        </p>
        <ul>
          <li>Dil tercihleri</li>
          <li>Bölge ayarları</li>
          <li>Kullanıcı arayüz tercihleri</li>
        </ul>

        <h3>2.3. Performans ve Analitik Çerezler</h3>
        <p>
          Web sitesinin performansını ölçmek ve iyileştirmek için kullanılan çerezlerdir.
        </p>
        <ul>
          <li>Google Analytics</li>
          <li>Sayfa görüntüleme istatistikleri</li>
          <li>Kullanıcı davranış analizi</li>
        </ul>

        <h3>2.4. Reklam ve Hedefleme Çerezleri</h3>
        <p>
          Size ve ilgi alanlarınıza daha uygun reklamlar göstermek için kullanılır.
        </p>

        <h2>3. Kullandığımız Çerezler</h2>
        <table class="min-w-full border-collapse border border-gray-300 my-4">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">Çerez Adı</th>
              <th class="border border-gray-300 px-4 py-2">Türü</th>
              <th class="border border-gray-300 px-4 py-2">Süre</th>
              <th class="border border-gray-300 px-4 py-2">Amaç</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-2">session_id</td>
              <td class="border border-gray-300 px-4 py-2">Zorunlu</td>
              <td class="border border-gray-300 px-4 py-2">Oturum</td>
              <td class="border border-gray-300 px-4 py-2">Kullanıcı oturum yönetimi</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">csrf_token</td>
              <td class="border border-gray-300 px-4 py-2">Zorunlu</td>
              <td class="border border-gray-300 px-4 py-2">Oturum</td>
              <td class="border border-gray-300 px-4 py-2">Güvenlik</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">locale</td>
              <td class="border border-gray-300 px-4 py-2">İşlevsel</td>
              <td class="border border-gray-300 px-4 py-2">1 yıl</td>
              <td class="border border-gray-300 px-4 py-2">Dil tercihi</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-2">_ga</td>
              <td class="border border-gray-300 px-4 py-2">Analitik</td>
              <td class="border border-gray-300 px-4 py-2">2 yıl</td>
              <td class="border border-gray-300 px-4 py-2">Google Analytics</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Çerez Yönetimi</h2>
        <p>
          Tarayıcınızın ayarlarından çerezleri kabul etmeme, sınırlandırma veya silme seçeneklerini kullanabilirsiniz.
        </p>

        <h3>Popüler Tarayıcılarda Çerez Ayarları:</h3>
        <ul>
          <li><strong>Google Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler ve diğer site verileri</li>
          <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
          <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezleri ve web sitesi verilerini yönet</li>
          <li><strong>Edge:</strong> Ayarlar → Gizlilik, arama ve hizmetler → Çerezler ve site izinleri</li>
        </ul>

        <p class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <strong>Önemli:</strong> Çerezleri devre dışı bırakmanız durumunda web sitesinin bazı
          özellikleri düzgün çalışmayabilir.
        </p>

        <h2>5. Üçüncü Taraf Çerezler</h2>
        <p>
          Web sitemizde, üçüncü taraf hizmet sağlayıcıların çerezleri de kullanılmaktadır:
        </p>
        <ul>
          <li><strong>Google Analytics:</strong> Web sitesi trafiği analizi</li>
          <li><strong>Google Maps:</strong> Konum hizmetleri</li>
          <li><strong>YouTube:</strong> Video içerik gösterimi</li>
          <li><strong>Social Media:</strong> Sosyal medya paylaşım butonları</li>
        </ul>

        <h2>6. Haklarınız</h2>
        <p>
          KVKK kapsamında, çerezler aracılığıyla toplanan verilerinizle ilgili olarak:
        </p>
        <ul>
          <li>Hangi verilerin toplandığını öğrenme</li>
          <li>Verilerin işlenme amacını öğrenme</li>
          <li>Verilerin silinmesini talep etme</li>
          <li>Çerezlerin kullanımına itiraz etme haklarına sahipsiniz</li>
        </ul>

        <h2>7. İletişim</h2>
        <p>
          Çerez politikamız hakkında sorularınız için:<br />
          E-posta: <strong>info@camliksk.com</strong>
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Son Güncelleme: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  },
  "kullanim-sartlari": {
    title: "Kullanım Şartları",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>Kullanım Şartları</h1>

        <h2>1. Genel Hükümler</h2>
        <p>
          Bu web sitesini (camliksk.com) kullanarak aşağıdaki kullanım şartlarını kabul etmiş sayılırsınız.
          Bu şartları kabul etmiyorsanız, lütfen web sitemizi kullanmayınız.
        </p>

        <h2>2. Tanımlar</h2>
        <ul>
          <li><strong>Kulüp/Biz:</strong> Çamlık Spor Kulübü</li>
          <li><strong>Web Sitesi:</strong> camliksk.com adresi ve alt sayfaları</li>
          <li><strong>Kullanıcı/Siz:</strong> Web sitesini ziyaret eden veya hizmetlerimizi kullanan kişiler</li>
          <li><strong>Hizmet:</strong> Kulüp tarafından sunulan futbol eğitimi ve ilgili hizmetler</li>
          <li><strong>Üye:</strong> Kulübe kayıt olmuş ve antrenman programlarına katılan kişiler</li>
        </ul>

        <h2>3. Hizmet Kapsamı</h2>
        <h3>3.1. Sunulan Hizmetler</h3>
        <ul>
          <li>Futbol eğitimi ve antrenman programları</li>
          <li>Yaş gruplarına göre kategorize edilmiş eğitimler</li>
          <li>Turnuva ve müsabaka organizasyonları</li>
          <li>Yetenek gelişim programları</li>
          <li>Spor malzeme satışı</li>
        </ul>

        <h3>3.2. Eğitim Programları</h3>
        <ul>
          <li>Erkek futbol eğitimi</li>
          <li>Kız futbol eğitimi</li>
          <li>Futsal eğitimi</li>
          <li>E-Spor programları</li>
        </ul>

        <h2>4. Üyelik ve Kayıt</h2>
        <h3>4.1. Üyelik Şartları</h3>
        <ul>
          <li>5-16 yaş arası çocuklar üye olabilir</li>
          <li>18 yaş altı için veli/vasi onayı zorunludur</li>
          <li>Sağlık raporu ibraz edilmelidir</li>
          <li>Üyelik formu eksiksiz doldurulmalıdır</li>
        </ul>

        <h3>4.2. Kayıt Süreci</h3>
        <ol>
          <li>Online ön kayıt formu doldurulması</li>
          <li>Kulüp yetkilisi ile iletişim</li>
          <li>Gerekli belgelerin teslimi</li>
          <li>Ücret ödemesi</li>
          <li>Kayıt onayı ve gruba yerleştirme</li>
        </ol>

        <h2>5. Ücretler ve Ödemeler</h2>
        <h3>5.1. Ödeme Şartları</h3>
        <ul>
          <li>Ücretler aylık, 3 aylık veya yıllık olarak ödenebilir</li>
          <li>Ödemeler kredi kartı, banka havalesi veya nakit olarak yapılabilir</li>
          <li>Aidat ödemeleri her ayın ilk haftasında yapılmalıdır</li>
          <li>Geç ödemelerde %10 gecikme zammı uygulanır</li>
        </ul>

        <h3>5.2. İade Politikası</h3>
        <ul>
          <li>İlk 2 hafta içinde üyelikten ayrılmalarda tam iade yapılır</li>
          <li>Tıbbi nedenlerle ayrılmalarda (rapor ile) kalan süre iadesi yapılır</li>
          <li>Kulüp kaynaklı iptal durumlarında tam iade yapılır</li>
          <li>Kullanıcı isteğiyle iptal durumlarında iade yapılmaz</li>
        </ul>

        <h2>6. Kullanıcı Sorumlulukları</h2>
        <h3>6.1. Genel Sorumluluklar</h3>
        <ul>
          <li>Doğru ve güncel bilgi vermek</li>
          <li>Kulüp kurallarına uymak</li>
          <li>Antrenman saatlerine riayet etmek</li>
          <li>Spor malzemelerine özen göstermek</li>
          <li>Diğer katılımcılara saygılı olmak</li>
        </ul>

        <h3>6.2. Veli/Vasi Sorumlulukları</h3>
        <ul>
          <li>Çocuğun sağlık durumu hakkında bilgi vermek</li>
          <li>Alerji ve kronik hastalıkları bildirmek</li>
          <li>Düzenli ödeme yapmak</li>
          <li>Acil durum iletişim bilgilerini güncel tutmak</li>
          <li>Çocuğun antrenman ve müsabaka katılımını takip etmek</li>
        </ul>

        <h2>7. Kulüp Sorumlulukları</h2>
        <ul>
          <li>Kaliteli eğitim hizmeti sunmak</li>
          <li>Güvenli antrenman ortamı sağlamak</li>
          <li>Lisanslı ve deneyimli eğitmenler çalıştırmak</li>
          <li>Kişisel verileri korumak</li>
          <li>Düzenli bilgilendirme yapmak</li>
        </ul>

        <h2>8. Sağlık ve Güvenlik</h2>
        <h3>8.1. Sağlık Şartları</h3>
        <ul>
          <li>Üyeler yıllık sağlık raporu ibraz etmelidir</li>
          <li>Bulaşıcı hastalık durumunda kulüp bilgilendirilmelidir</li>
          <li>Sakatlık durumunda doktor raporu gereklidir</li>
        </ul>

        <h3>8.2. Güvenlik Önlemleri</h3>
        <ul>
          <li>Antrenman alanları düzenli kontrol edilir</li>
          <li>İlk yardım ekipmanları bulundurulur</li>
          <li>Acil durum planları hazırdır</li>
          <li>Sigortalama yapılmıştır</li>
        </ul>

        <h2>9. Fikri Mülkiyet Hakları</h2>
        <p>
          Web sitesinde yer alan tüm içerik, logo, tasarım, metin, grafik, yazılım ve diğer
          materyaller Çamlık Spor Kulübü'nün mülkiyetindedir ve telif hakları yasalarıyla korunmaktadır.
        </p>

        <h2>10. Fotoğraf ve Video Kullanımı</h2>
        <p>
          Antrenman, müsabaka ve etkinliklerde çekilen fotoğraf ve videoların sosyal medya,
          web sitesi ve tanıtım materyallerinde kullanılması için veli onayı alınmaktadır.
        </p>

        <h2>11. Sözleşmenin Feshi</h2>
        <h3>11.1. Kullanıcı Tarafından Fesih</h3>
        <ul>
          <li>En az 15 gün önceden yazılı bildirim</li>
          <li>Ödeme yükümlülüklerinin tamamlanması</li>
          <li>Kulüp malzemelerinin iade edilmesi</li>
        </ul>

        <h3>11.2. Kulüp Tarafından Fesih</h3>
        <p>Aşağıdaki durumlarda kulüp üyeliği tek taraflı feshedebilir:</p>
        <ul>
          <li>Ödeme yükümlülüklerinin yerine getirilmemesi</li>
          <li>Kurallara aykırı davranışlar</li>
          <li>Diğer katılımcılara zarar verici davranışlar</li>
          <li>Yanlış veya eksik bilgi verilmesi</li>
        </ul>

        <h2>12. Sorumluluk Reddi</h2>
        <ul>
          <li>Kulüp, katılımcıların kişisel eşyalarından sorumlu değildir</li>
          <li>Kurallara aykırı davranışlardan kaynaklanan sakatlıklardan sorumlu değildir</li>
          <li>Force majeure (mücbir sebep) durumlarında sorumluluk kabul etmez</li>
        </ul>

        <h2>13. Uyuşmazlıkların Çözümü</h2>
        <p>
          Bu sözleşmeden doğabilecek uyuşmazlıklarda öncelikle taraflar anlaşmaya çalışacaktır.
          Anlaşma sağlanamazsa İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>

        <h2>14. Değişiklik Hakkı</h2>
        <p>
          Kulüp, bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutar.
          Değişiklikler web sitesinde yayımlandığı tarihte yürürlüğe girer.
        </p>

        <h2>15. İletişim</h2>
        <p>
          Sorularınız için:<br />
          E-posta: <strong>info@camliksk.com</strong><br />
          Telefon: <strong>0532 241 24 31</strong><br />
          Adres: <strong>Çamlık Spor Kulübü, İstanbul</strong>
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Yürürlük Tarihi: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  },
  "on-kayit-sozlesmesi": {
    title: "Ön Kayıt Sözleşmesi",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>Ön Kayıt Sözleşmesi</h1>

        <h2>Taraflar</h2>
        <p><strong>KULÜP:</strong> Çamlık Spor Kulübü</p>
        <p><strong>VELİ/VASİ:</strong> Aşağıda bilgileri belirtilen veli/vasi</p>
        <p><strong>SPORCU:</strong> Aşağıda bilgileri belirtilen sporcu adayı</p>

        <h2>1. Sözleşmenin Konusu</h2>
        <p>
          İşbu sözleşme, veli/vasi tarafından çocuğunun Çamlık Spor Kulübü'ne ön kaydının
          yapılması ve bu süreçte tarafların hak ve yükümlülüklerinin belirlenmesi amacıyla
          düzenlenmiştir.
        </p>

        <h2>2. Ön Kayıt Süreci</h2>
        <h3>2.1. Ön Kayıt Nedir?</h3>
        <p>
          Ön kayıt, sporcu adayının kulüp ile tanışması, değerlendirme sürecinden geçmesi ve
          uygunluk durumunun belirlenmesi için yapılan ön başvurudur. Ön kayıt, kesin üyelik
          anlamına gelmez.
        </p>

        <h3>2.2. Ön Kayıt Aşamaları</h3>
        <ol>
          <li><strong>Online Başvuru:</strong> Web sitesi üzerinden ön kayıt formu doldurulması</li>
          <li><strong>İletişim:</strong> Kulüp yetkilisinin 3 iş günü içinde aileleri araması</li>
          <li><strong>Tanışma:</strong> Kulüp tesislerinde tanışma ve bilgilendirme görüşmesi</li>
          <li><strong>Değerlendirme:</strong> Sporcu adayının yetenek değerlendirmesi (opsiyonel)</li>
          <li><strong>Karar:</strong> Kesin kayıt kararının verilmesi</li>
        </ol>

        <h2>3. Gerekli Belgeler</h2>
        <p>Kesin kayıt için aşağıdaki belgeler talep edilecektir:</p>
        <ul>
          <li>Nüfus cüzdanı fotokopisi</li>
          <li>2 adet vesikalık fotoğraf</li>
          <li>Sağlık raporu (Spor yapmasında sakınca yoktur ibareli)</li>
          <li>Veli/vasi kimlik fotokopisi</li>
          <li>İkametgah belgesi (varsa)</li>
        </ul>

        <h2>4. Veli/Vasi Yükümlülükleri</h2>
        <h3>4.1. Bilgilendirme Yükümlülüğü</h3>
        <p>Veli/vasi, aşağıdaki bilgileri doğru ve eksiksiz vermekle yükümlüdür:</p>
        <ul>
          <li>Sporcu adayının kişisel bilgileri</li>
          <li>Sağlık durumu ve varsa kronik hastalıklar</li>
          <li>Alerji bilgileri</li>
          <li>Kullandığı sürekli ilaçlar</li>
          <li>Geçirdiği ameliyatlar ve sakatlıklar</li>
          <li>İletişim bilgileri</li>
        </ul>

        <h3>4.2. İzin ve Onaylar</h3>
        <p>Veli/vasi aşağıdaki hususları kabul eder:</p>
        <ul>
          <li>Çocuğumun futbol eğitimi almasına izin veriyorum</li>
          <li>Sağlık durumunun spor yapmaya uygun olduğunu beyan ediyorum</li>
          <li>Acil durumlarda gerekli tıbbi müdahaleye izin veriyorum</li>
          <li>Antrenman ve müsabakalarda fotoğraf/video çekilmesine izin veriyorum</li>
          <li>Kulüp kurallarına uymayı kabul ediyorum</li>
        </ul>

        <h2>5. Kulüp Yükümlülükleri</h2>
        <ul>
          <li>3 iş günü içinde aileleri aramak</li>
          <li>Eğitim programları hakkında detaylı bilgi vermek</li>
          <li>Ücretlendirme hakkında şeffaf bilgilendirme yapmak</li>
          <li>Sporcu adayını objektif kriterlere göre değerlendirmek</li>
          <li>Kişisel verileri KVKK kapsamında korumak</li>
        </ul>

        <h2>6. Kişisel Verilerin Korunması</h2>
        <p>
          Bu sözleşme kapsamında toplanan kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması
          Kanunu uyarınca işlenecek ve korunacaktır. Detaylı bilgi için lütfen KVKK Aydınlatma
          Metnimizi inceleyiniz.
        </p>

        <h2>7. İşlenen Kişisel Veriler</h2>
        <ul>
          <li><strong>Sporcu:</strong> Ad, soyad, doğum tarihi, cinsiyet, sağlık bilgileri</li>
          <li><strong>Veli/Vasi:</strong> Ad, soyad, telefon, e-posta, adres, T.C. kimlik numarası</li>
        </ul>

        <h2>8. Verilerin Kullanım Amacı</h2>
        <ul>
          <li>İletişim ve bilgilendirme</li>
          <li>Sporcu değerlendirme</li>
          <li>Grup yerleştirme</li>
          <li>Sağlık ve güvenlik önlemleri</li>
          <li>Hizmet kalitesinin artırılması</li>
        </ul>

        <h2>9. Ön Kayıt Ücreti</h2>
        <ul>
          <li>Ön kayıt ücretsizdir</li>
          <li>Hiçbir ödeme talep edilmez</li>
          <li>Kesin kayıt aşamasında ücretler netleşecektir</li>
        </ul>

        <h2>10. İptal ve Cayma Hakkı</h2>
        <h3>10.1. Veli/Vasi Cayma Hakkı</h3>
        <ul>
          <li>Ön kayıt aşamasında herhangi bir gerekçe göstermeden cayılabilir</li>
          <li>Hiçbir ücret ödenmez</li>
          <li>Kişisel veriler silinmesini talep edebilir</li>
        </ul>

        <h3>10.2. Kulüp Red Hakkı</h3>
        <p>Kulüp, aşağıdaki durumlarda kesin kaydı reddetme hakkına sahiptir:</p>
        <ul>
          <li>Kontenjan dolması</li>
          <li>Yaş grubu uygunsuzluğu</li>
          <li>Sağlık raporu uygun değilse</li>
          <li>Yanlış veya eksik bilgi verilmesi</li>
        </ul>

        <h2>11. Sözleşmenin Süresi</h2>
        <p>
          Bu ön kayıt sözleşmesi, form doldurulduğu tarihten itibaren 30 gün geçerlidir.
          Bu süre içinde kesin kayıt yapılmazsa otomatik olarak geçersiz hale gelir.
        </p>

        <h2>12. Bilgilendirme ve İletişim</h2>
        <p>
          Kulüp, ön kayıt süreciyle ilgili gelişmeleri e-posta ve telefon yoluyla bildirecektir.
          Veli/vasi, iletişim bilgilerini güncel tutmakla yükümlüdür.
        </p>

        <h2>13. Uyuşmazlıkların Çözümü</h2>
        <p>
          Bu sözleşmeden doğabilecek uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
        </p>

        <h2>14. Yürürlük</h2>
        <p>
          Bu sözleşme, ön kayıt formunun gönderilmesiyle birlikte yürürlüğe girer.
        </p>

        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
          <h3 class="text-lg font-bold mb-2">Beyan ve Taahhüt</h3>
          <p>
            Ben veli/vasi olarak, yukarıda yer alan tüm hükümleri okuduğumu, anladığımı ve
            kabul ettiğimi, çocuğum adına bu ön kayıt sözleşmesini imzalamaya yetkili olduğumu
            beyan ve taahhüt ederim.
          </p>
        </div>

        <h2>15. İletişim Bilgileri</h2>
        <p>
          <strong>Çamlık Spor Kulübü</strong><br />
          E-posta: info@camliksk.com<br />
          Telefon: 0532 241 24 31<br />
          Web: www.camliksk.com
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Sözleşme Tarihi: ${new Date().toLocaleDateString('tr-TR')}
        </p>

        <div class="border-t-2 border-gray-300 pt-8 mt-12">
          <p class="text-sm text-gray-600 italic">
            Not: Bu ön kayıt sözleşmesi, "Ön Kayıt Sözleşmesini Okudum" kutucuğunu işaretleyerek
            elektronik olarak kabul edilmiş sayılır. Elektronik onay, ıslak imza ile aynı hukuki
            geçerliliğe sahiptir.
          </p>
        </div>
      </div>
    `
  }
};

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocuments[slug];

  if (!doc) {
    return { title: "Sayfa Bulunamadı" };
  }

  return {
    title: `${doc.title} | Çamlık Spor Kulübü`,
    description: doc.title,
  };
}

export default async function LegalDocumentPage({ params }: LegalPageProps) {
  const { slug } = await params;
  const doc = legalDocuments[slug];

  if (!doc) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <div dangerouslySetInnerHTML={{ __html: doc.content }} />
      </div>
    </div>
  );
}
