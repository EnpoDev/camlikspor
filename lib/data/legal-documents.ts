// Shared legal documents content — used by both /[dealerSlug]/legal/[slug] and /legal/[slug] routes

export const legalDocuments: Record<string, { title: string; content: string }> = {
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

        <h2>4-15. ...</h2>
        <p>Diğer maddeler için lütfen tam metni inceleyiniz.</p>

        <p class="text-sm text-gray-600 mt-8">
          Yürürlük Tarihi: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  },
  "mesafeli-satis-sozlesmesi": {
    title: "Mesafeli Satış Sözleşmesi",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>Mesafeli Satış Sözleşmesi</h1>

        <h2>1. Taraflar</h2>
        <p><strong>SATICI:</strong></p>
        <ul>
          <li><strong>Unvan:</strong> Çamlık Spor Kulübü</li>
          <li><strong>Adres:</strong> Çamlık Spor Kulübü, İstanbul</li>
          <li><strong>Telefon:</strong> 0532 241 24 31</li>
          <li><strong>E-posta:</strong> info@camliksk.com</li>
          <li><strong>Web:</strong> www.camliksk.com</li>
        </ul>
        <p><strong>ALICI:</strong> Sipariş formunda bilgileri belirtilen kişi</p>

        <h2>2. Sözleşmenin Konusu</h2>
        <p>
          İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
          Yönetmeliği hükümleri uyarınca, ALICI'nın SATICI'ya ait web sitesinden elektronik ortamda
          sipariş verdiği ürünlerin satışı ve teslimi ile ilgili tarafların hak ve yükümlülüklerini
          düzenlemektedir.
        </p>

        <h2>3. Sözleşme Konusu Ürün/Hizmet Bilgileri</h2>
        <p>
          Ürünün/hizmetin türü, adedi, marka/modeli, rengi, beden/ölçüsü ve satış fiyatı (KDV dahil)
          sipariş onay sayfasında ve siparişe ilişkin e-posta bildiriminde belirtilmiştir. Ürün fiyatı
          sipariş anındaki fiyattır.
        </p>

        <h2>4. Genel Hükümler</h2>
        <ul>
          <li>ALICI, satışa konu ürünlerin temel nitelikleri, satış fiyatı, ödeme şekli ve teslimata ilişkin bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli onayı verdiğini kabul ve beyan eder.</li>
          <li>SATICI, sözleşme konusu ürünün sağlam, eksiksiz, siparişte belirtilen niteliklere uygun ve varsa garanti belgeleri ile teslim edilmesinden sorumludur.</li>
          <li>SATICI, sözleşmeden doğan ifa yükümlülüğünün süresi dolmadan ALICI'yı bilgilendirmek ve açıkça onayını almak suretiyle eşit kalite ve fiyatta farklı bir ürün tedarik edebilir.</li>
        </ul>

        <h2>5. Teslimat</h2>
        <ul>
          <li>Ürünler, sipariş tarihinden itibaren en geç <strong>30 (otuz) gün</strong> içinde teslim edilir.</li>
          <li>Ürünler, ALICI'nın sipariş formunda belirttiği adrese teslim edilecektir.</li>
          <li>Teslimat ücreti ALICI'ya aittir. Kampanya kapsamında ücretsiz kargo sunulabilir.</li>
          <li>ALICI adına başka bir kişi/kuruluşa teslimat yapılması halinde, teslim edilen kişinin yetkisiz olduğu iddiasından SATICI sorumlu tutulamaz.</li>
          <li>SATICI, stokta bulunmaması veya mücbir sebep halinde ALICI'yı bilgilendirip sipariş bedelini 14 gün içinde iade eder.</li>
        </ul>

        <h2>6. Ödeme</h2>
        <ul>
          <li>Sipariş bedeli, sipariş sırasında kredi kartı, banka kartı veya banka havalesi/EFT ile ödenebilir.</li>
          <li>Tüm fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir.</li>
          <li>SATICI, sipariş onayı almadan ürünü göndermekle yükümlü değildir.</li>
        </ul>

        <h2>7. Cayma Hakkı</h2>
        <p>
          ALICI, sözleşme konusu ürünün kendisine veya gösterdiği adresteki kişi/kuruluşa teslim tarihinden
          itibaren <strong>14 (on dört) gün</strong> içinde herhangi bir gerekçe göstermeksizin ve cezai şart
          ödemeksizin sözleşmeden cayma hakkına sahiptir.
        </p>

        <h3>7.1. Cayma Hakkının Kullanılması</h3>
        <ul>
          <li>Cayma hakkının kullanılması için 14 günlük süre içinde SATICI'ya yazılı bildirimde bulunulması (e-posta veya posta yoluyla) yeterlidir.</li>
          <li>Cayma bildiriminde sipariş numarası, ad-soyad ve iade edilecek ürün bilgileri belirtilmelidir.</li>
          <li>Cayma hakkı bildirimi yapıldıktan sonra ürün, <strong>10 gün</strong> içinde SATICI'ya iade edilmelidir.</li>
          <li>İade kargo ücreti ALICI'ya aittir.</li>
        </ul>

        <h3>7.2. Cayma Hakkının Kullanılamayacağı Durumlar</h3>
        <p>Aşağıdaki ürünlerde cayma hakkı kullanılamaz:</p>
        <ul>
          <li>Fiyatı finansal piyasalardaki dalgalanmalara bağlı olarak değişen ürünler</li>
          <li>ALICI'nın istekleri doğrultusunda hazırlanan veya kişiselleştirilen ürünler (isim baskılı formalar vb.)</li>
          <li>Çabuk bozulabilen veya son kullanma tarihi geçebilecek ürünler</li>
          <li>Tesliminden sonra ambalaj, bant, mühür, paket gibi koruyucu unsurları açılmış olan ürünler (hijyen ürünleri)</li>
          <li>Kullanılmış veya yıkanmış tekstil ürünleri</li>
        </ul>

        <h3>7.3. İade Koşulları</h3>
        <ul>
          <li>Ürün, orijinal ambalajında, kullanılmamış ve hasar görmemiş olmalıdır.</li>
          <li>Ürün etiketi ve varsa aksesuarları eksiksiz iade edilmelidir.</li>
          <li>Fatura aslı veya kopyası iade ile birlikte gönderilmelidir.</li>
        </ul>

        <h2>8. İade ve Geri Ödeme</h2>
        <ul>
          <li>Cayma hakkının kullanılması halinde, ürünün SATICI'ya ulaşmasından itibaren <strong>14 gün</strong> içinde ödeme, ALICI'nın kullandığı ödeme aracına uygun şekilde ve herhangi bir masraf veya yükümlülük altına sokmaksızın tek seferde iade edilir.</li>
          <li>Kredi kartı ile yapılan ödemelerde iade, kredi kartına yapılır. Banka, iade tutarını 2-3 iş günü içinde ALICI hesabına yansıtır. Taksitli alımlarda iade, taksit planına uygun olarak yapılır.</li>
          <li>Havale/EFT ile yapılan ödemelerde iade, ALICI'nın bildireceği banka hesabına yapılır.</li>
          <li>Ayıplı ürün iadelerinde kargo ücreti SATICI'ya aittir.</li>
        </ul>

        <h2>9. Garanti</h2>
        <ul>
          <li>Ürünlerin garanti süresi ve koşulları, ürüne göre değişmekte olup ürün sayfasında belirtilmiştir.</li>
          <li>Garanti kapsamındaki sorunlar için SATICI'nın müşteri hizmetleri ile iletişime geçilmelidir.</li>
          <li>Garanti kapsamı dışındaki hasarlar (düşürme, kötü kullanım vb.) garanti dışıdır.</li>
        </ul>

        <h2>10. Uyuşmazlık Çözümü</h2>
        <p>
          Bu sözleşmeden doğan uyuşmazlıklarda, Gümrük ve Ticaret Bakanlığı tarafından her yıl
          belirlenen parasal sınırlar dahilinde İl veya İlçe Tüketici Hakem Heyetleri, bu sınırları
          aşan durumlarda Tüketici Mahkemeleri yetkilidir.
        </p>

        <h2>11. Yürürlük</h2>
        <p>
          İşbu sözleşme, ALICI tarafından elektronik ortamda onaylanması ile birlikte yürürlüğe girer.
        </p>

        <h2>12. İletişim Bilgileri</h2>
        <p>
          <strong>Çamlık Spor Kulübü</strong><br />
          E-posta: info@camliksk.com<br />
          Telefon: 0532 241 24 31<br />
          Web: www.camliksk.com
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Sözleşme Tarihi: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  },
  "iade-ve-iptal-politikasi": {
    title: "İade ve İptal Politikası",
    content: `
      <div class="prose prose-slate max-w-none">
        <h1>İade ve İptal Politikası</h1>

        <h2>1. Genel Bilgiler</h2>
        <p>
          6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği
          kapsamında, Çamlık Spor Kulübü online mağazasından satın alınan ürünlerin iade ve iptal
          koşulları aşağıda belirtilmiştir.
        </p>

        <h2>2. Sipariş İptali</h2>
        <h3>2.1. Kargoya Verilmeden Önce</h3>
        <p>
          Siparişiniz henüz kargoya verilmemişse, müşteri hizmetlerimize ulaşarak siparişinizi
          ücretsiz olarak iptal edebilirsiniz.
        </p>

        <h2>3. Cayma Hakkı</h2>
        <p>
          Ürünün teslim tarihinden itibaren <strong>14 gün</strong> içinde cayma hakkınızı kullanabilirsiniz.
        </p>

        <h3>3.1. Cayma Hakkı Kullanım Şartları</h3>
        <ul>
          <li>Ürün kullanılmamış ve denenmemiş olmalıdır</li>
          <li>Orijinal ambalajı açılmamış veya bozulmamış olmalıdır</li>
          <li>Ürün etiketi kesilmemiş ve çıkarılmamış olmalıdır</li>
          <li>Fatura aslı veya kopyası iade ile birlikte gönderilmelidir</li>
        </ul>

        <h3>3.2. Cayma Hakkı Kullanılamayacak Ürünler</h3>
        <ul>
          <li>İsim veya numara baskılı kişiselleştirilmiş formalar</li>
          <li>Hijyen açısından iade edilemeyen iç giyim ürünleri</li>
          <li>Kullanılmış veya yıkanmış tekstil ürünleri</li>
        </ul>

        <h2>4. İade Süreci</h2>
        <ol>
          <li><strong>Bildirim:</strong> info@camliksk.com adresine iade talebinizi iletin</li>
          <li><strong>Onay:</strong> Talebiniz en geç 2 iş günü içinde değerlendirilir</li>
          <li><strong>Kargo:</strong> Ürünü orijinal ambalajında gönderin</li>
          <li><strong>Kontrol:</strong> Ürün 3 iş günü içinde kontrol edilir</li>
          <li><strong>İade:</strong> 14 gün içinde ödemeniz iade edilir</li>
        </ol>

        <h2>5. Geri Ödeme</h2>
        <ul>
          <li><strong>Kredi Kartı:</strong> 2-3 iş günü içinde yansıtılır</li>
          <li><strong>Banka Havalesi/EFT:</strong> 3-5 iş günü içinde aktarılır</li>
        </ul>

        <h2>6. İletişim</h2>
        <p>
          E-posta: <strong>info@camliksk.com</strong><br />
          Telefon: <strong>0532 241 24 31</strong>
        </p>

        <p class="text-sm text-gray-600 mt-8">
          Son Güncelleme: ${new Date().toLocaleDateString('tr-TR')}
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

        <p class="text-sm text-gray-600 mt-8">
          Sözleşme Tarihi: ${new Date().toLocaleDateString('tr-TR')}
        </p>
      </div>
    `
  }
};

const slugAliases: Record<string, string> = {
  "gizlilik-sozlesmesi": "kvkk",
};

export function resolveDocument(slug: string) {
  const resolvedSlug = slugAliases[slug] || slug;
  return legalDocuments[resolvedSlug];
}
