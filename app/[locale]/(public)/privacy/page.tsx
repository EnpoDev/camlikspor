import { getDictionary } from "@/lib/i18n/get-dictionary";
import { i18n, type Locale } from "@/lib/i18n/config";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: localeParam } = await params;

  const locale = i18n.locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : i18n.defaultLocale;

  const dictionary = await getDictionary(locale);
  const privacy = dictionary.privacy || {};

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            {privacy.title || "Gizlilik Politikası"}
          </h1>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="space-y-8">
              {/* Giriş */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.introTitle || "Giriş"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {privacy.introText ||
                    "Bu gizlilik politikası, web sitemizi ziyaret ettiğinizde veya hizmetlerimizi kullandığınızda toplanan kişisel bilgilerinizin nasıl işlendiğini açıklamaktadır."}
                </p>
              </section>

              {/* Toplanan Bilgiler */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.collectedInfoTitle || "Toplanan Bilgiler"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {privacy.collectedInfoText ||
                    "Hizmetlerimizi kullandığınızda aşağıdaki bilgileri toplayabiliriz:"}
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
                  <li>{privacy.infoItem1 || "Ad, soyad ve iletişim bilgileri"}</li>
                  <li>{privacy.infoItem2 || "E-posta adresi ve telefon numarası"}</li>
                  <li>{privacy.infoItem3 || "Ödeme ve fatura bilgileri"}</li>
                  <li>{privacy.infoItem4 || "Kullanım verileri ve tercihler"}</li>
                </ul>
              </section>

              {/* Bilgilerin Kullanımı */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.usageTitle || "Bilgilerin Kullanımı"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {privacy.usageText ||
                    "Toplanan bilgiler aşağıdaki amaçlarla kullanılır:"}
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
                  <li>{privacy.usageItem1 || "Hizmetlerimizi sağlamak ve geliştirmek"}</li>
                  <li>{privacy.usageItem2 || "Sipariş ve ödemeleri işlemek"}</li>
                  <li>{privacy.usageItem3 || "Müşteri desteği sağlamak"}</li>
                  <li>{privacy.usageItem4 || "Yasal yükümlülükleri yerine getirmek"}</li>
                </ul>
              </section>

              {/* Bilgi Güvenliği */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.securityTitle || "Bilgi Güvenliği"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {privacy.securityText ||
                    "Kişisel bilgilerinizin güvenliğini sağlamak için endüstri standartlarında güvenlik önlemleri kullanıyoruz. Verileriniz SSL şifrelemesi ile korunmaktadır."}
                </p>
              </section>

              {/* Çerezler */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.cookiesTitle || "Çerezler"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {privacy.cookiesText ||
                    "Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz."}
                </p>
              </section>

              {/* Üçüncü Taraf Paylaşımı */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.thirdPartyTitle || "Üçüncü Taraf Paylaşımı"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {privacy.thirdPartyText ||
                    "Kişisel bilgileriniz, yasal gereklilikler dışında üçüncü taraflarla paylaşılmaz. Hizmet sağlayıcılarımız verilerinizi yalnızca hizmet sunumu amacıyla işler."}
                </p>
              </section>

              {/* Kullanıcı Hakları */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.rightsTitle || "Kullanıcı Hakları"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {privacy.rightsText ||
                    "Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:"}
                </p>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2 ml-4">
                  <li>{privacy.rightsItem1 || "Verilerinize erişim hakkı"}</li>
                  <li>{privacy.rightsItem2 || "Verilerin düzeltilmesini talep etme hakkı"}</li>
                  <li>{privacy.rightsItem3 || "Verilerin silinmesini talep etme hakkı"}</li>
                  <li>{privacy.rightsItem4 || "Veri işlemeye itiraz etme hakkı"}</li>
                </ul>
              </section>

              {/* İletişim */}
              <section>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
                  {privacy.contactTitle || "İletişim"}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {privacy.contactText ||
                    "Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz:"}
                </p>
                <div className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
                  <p>E-posta: info@camliksk.com</p>
                  <p>Telefon: 0532 241 24 31</p>
                </div>
              </section>

              {/* Güncelleme */}
              <section>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
                  {privacy.updateText ||
                    "Bu gizlilik politikası son olarak"} {new Date().toLocaleDateString(locale === "tr" ? "tr-TR" : locale === "es" ? "es-ES" : "en-US", { year: 'numeric', month: 'long', day: 'numeric' })} {privacy.updateText2 || "tarihinde güncellenmiştir."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
