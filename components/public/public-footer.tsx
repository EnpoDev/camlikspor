import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  CreditCard,
  HeadphonesIcon,
  ChevronRight,
  MessageCircle,
  FileText,
} from "lucide-react";

interface LegalDocument {
  id: string;
  title: string;
  slug: string;
  fileUrl: string | null;
}

interface PublicFooterProps {
  dealerSlug: string;
  dealerName: string;
  locale: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  contactAddress?: string | null;
  socialFacebook?: string | null;
  socialInstagram?: string | null;
  socialTwitter?: string | null;
  socialYoutube?: string | null;
  legalDocuments?: LegalDocument[];
  dictionary: {
    shop: string;
    contact: string;
    allRightsReserved: string;
    quickLinks: string;
    followUs: string;
    privacy?: string;
  };
  useRootPaths?: boolean;
}

export function PublicFooter({
  dealerSlug,
  dealerName,
  locale,
  contactPhone,
  contactEmail,
  contactAddress,
  socialFacebook,
  socialInstagram,
  socialTwitter,
  socialYoutube,
  legalDocuments = [],
  dictionary,
  useRootPaths = false,
}: PublicFooterProps) {
  // Hardcoded contact information
  const hardcodedPhone = "0532 241 24 31";
  const hardcodedEmail = "info@camliksk.com";
  const hardcodedAddress = "Ihlamurkuyu, Petrol Yolu Cd. no:63, 34771 Ümraniye/İstanbul";
  const hardcodedWhatsApp = "905322412431"; // International format for WhatsApp

  // Build paths based on whether we're using root paths or dealer-specific paths
  const basePath = useRootPaths ? `/${locale}` : `/${locale}/${dealerSlug}`;

  const quickLinks = [
    { href: basePath, label: "Ana Sayfa" },
    { href: `${basePath}/shop`, label: "Mağaza" },
    { href: `${basePath}/contact`, label: "İletişim" },
    { href: `${basePath}/privacy`, label: dictionary.privacy || "Gizlilik Politikası" },
    ...legalDocuments
      .filter((doc) => doc.fileUrl)
      .map((doc) => ({
        href: doc.fileUrl!,
        label: doc.title,
        isExternal: true,
      })),
  ];

  const shopLinks = [
    { href: `${basePath}/shop`, label: "Tüm Ürünler" },
    { href: `${basePath}/shop?category=forma`, label: "Formalar" },
    { href: `${basePath}/shop?category=esofman`, label: "Eşofmanlar" },
    { href: `${basePath}/shop?category=aksesuar`, label: "Aksesuarlar" },
  ];

  const hasSocialLinks = socialFacebook || socialInstagram || socialTwitter || socialYoutube;
  const hasContactInfo = true; // Always show contact info

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      {/* Features Bar */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Ücretsiz Kargo</h4>
                <p className="text-xs text-slate-400">Tüm siparişlerde</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Güvenli Ödeme</h4>
                <p className="text-xs text-slate-400">256-bit SSL</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Taksit İmkanı</h4>
                <p className="text-xs text-slate-400">12 aya kadar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">7/24 Destek</h4>
                <p className="text-xs text-slate-400">Her zaman yanınızda</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-white/10 overflow-hidden border border-slate-700">
                  <Image
                    src="/logo.png"
                    alt={dealerName}
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <span className="text-xl font-bold">{dealerName}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Profesyonel futbol okulu eğitimi ile geleceğin yıldızlarını yetiştiriyoruz.
                Kaliteli spor malzemeleri ve formalarla sizlere hizmet veriyoruz.
              </p>
            </div>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {"isExternal" in link && link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm text-slate-400 hover:text-secondary transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-slate-400 hover:text-secondary transition-colors"
                    >
                      <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mağaza</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-slate-400 hover:text-secondary transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">İletişim</h3>
            {hasContactInfo && (
              <ul className="space-y-4">
                <li>
                  <a
                    href={`tel:${hardcodedPhone}`}
                    className="group flex items-start gap-3 text-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Telefon</span>
                      <span className="text-white font-medium">{hardcodedPhone}</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${hardcodedWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">WhatsApp</span>
                      <span className="text-white font-medium">{hardcodedPhone}</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${hardcodedEmail}`}
                    className="group flex items-start gap-3 text-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">E-posta</span>
                      <span className="text-white font-medium">{hardcodedEmail}</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(hardcodedAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-sm"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs block">Adres</span>
                      <span className="text-slate-400">{hardcodedAddress}</span>
                    </div>
                  </a>
                </li>
              </ul>
            )}

            {/* Social Links */}
            {hasSocialLinks && (
              <div className="pt-4">
                <h4 className="text-sm font-medium mb-3">Bizi Takip Edin</h4>
                <div className="flex gap-3">
                  {socialFacebook && (
                    <a
                      href={socialFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
                      aria-label={`${dealerName} Facebook sayfası (yeni sekmede açılır)`}
                    >
                      <Facebook className="h-6 w-6 text-white" aria-hidden="true" />
                    </a>
                  )}
                  {socialInstagram && (
                    <a
                      href={socialInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all"
                      aria-label={`${dealerName} Instagram sayfası (yeni sekmede açılır)`}
                    >
                      <Instagram className="h-6 w-6 text-white" aria-hidden="true" />
                    </a>
                  )}
                  {socialTwitter && (
                    <a
                      href={socialTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-colors"
                      aria-label={`${dealerName} Twitter sayfası (yeni sekmede açılır)`}
                    >
                      <Twitter className="h-6 w-6 text-white" aria-hidden="true" />
                    </a>
                  )}
                  {socialYoutube && (
                    <a
                      href={socialYoutube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"
                      aria-label={`${dealerName} YouTube kanalı (yeni sekmede açılır)`}
                    >
                      <Youtube className="h-6 w-6 text-white" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legal Documents Section */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link
              href={`/${locale}/legal/mesafeli-satis-sozlesmesi`}
              className="text-slate-400 hover:text-secondary transition-colors"
            >
              Mesafeli Satış Sözleşmesi
            </Link>
            <Link
              href={`/${locale}/legal/iade-ve-iptal-politikasi`}
              className="text-slate-400 hover:text-secondary transition-colors"
            >
              İade ve İptal Politikası
            </Link>
            <Link
              href={`/${locale}/legal/gizlilik-politikasi`}
              className="text-slate-400 hover:text-secondary transition-colors"
            >
              Gizlilik Politikası
            </Link>
            <Link
              href={`/${locale}/legal/kvkk`}
              className="text-slate-400 hover:text-secondary transition-colors"
            >
              K.V.K.K.
            </Link>
            <Link
              href={`/${locale}/legal/kullanim-sartlari`}
              className="text-slate-400 hover:text-secondary transition-colors"
            >
              Kullanım Şartları
            </Link>
            <a
              href="https://drive.google.com/file/d/1M2WOYDZUItOb3GV80gUjzZGlsEKFaBWg/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-secondary transition-colors flex items-center gap-1"
            >
              Yetki Belgesi
              <FileText className="h-3 w-3" />
            </a>
            {legalDocuments.filter((doc) => doc.fileUrl).map((doc) => (
              <a
                key={doc.id}
                href={doc.fileUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-secondary transition-colors flex items-center gap-1"
              >
                {doc.title}
                <FileText className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <span>&copy; {new Date().getFullYear()} {dealerName}.</span>
              <span>Tüm hakları saklıdır.</span>
            </div>

            {/* Payment - Garanti BBVA */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/garanti_logo.png"
                alt="Garanti BBVA"
                width={160}
                height={40}
                className="object-contain"
              />
              <p className="text-xs text-slate-400 text-center">
                Güvenli ödeme hizmeti Garanti BBVA tarafından sağlanmaktadır.
              </p>
            </div>

            <a
              href="https://cosmos.web.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-secondary transition-colors"
            >
              Web Tasarım: <span className="font-semibold">COSMOS</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
