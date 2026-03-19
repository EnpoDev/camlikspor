import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, ClipboardList } from "lucide-react";

interface CtaGridSectionProps {
  dealerSlug: string;
  locale: string;
  shopVisible: boolean;
  preRegVisible: boolean;
  preRegPath?: string; // defaults to /on-kayit
  dictionary: {
    store: string;
    preReg: string;
  };
}

const STORE_BG =
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80";
const PRE_REG_BG =
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=80";

interface CtaCardProps {
  href: string;
  backgroundSrc: string;
  label: string;
  icon: React.ReactNode;
  iconBadgeClass?: string;
  accentClass?: string;
}

function CtaCard({ href, backgroundSrc, label, icon, iconBadgeClass = "bg-primary/90", accentClass = "bg-primary" }: CtaCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex-1 min-h-[400px] overflow-hidden block"
    >
      {/* Background image */}
      <Image
        src={backgroundSrc}
        alt={label}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-75"
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Permanent gradient overlay — darkens bottom for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
        {/* Icon badge */}
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${iconBadgeClass} text-white shadow-lg transition-transform duration-300 group-hover:-translate-y-1`}>
          {icon}
        </div>

        {/* Label */}
        <div className="flex items-center gap-3">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-wide uppercase">
            {label}
          </h3>
          <ArrowRight className="h-6 w-6 text-white/70 transition-all duration-300 group-hover:translate-x-2 group-hover:text-white" aria-hidden="true" />
        </div>

        {/* Bottom accent line */}
        <div className={`mt-4 h-[3px] w-12 rounded-full ${accentClass} transition-all duration-300 group-hover:w-24`} />
      </div>
    </Link>
  );
}

export function CtaGridSection({
  dealerSlug,
  locale,
  shopVisible,
  preRegVisible,
  preRegPath = "on-kayit",
  dictionary,
}: CtaGridSectionProps) {
  const visibleCards: React.ReactNode[] = [];

  if (shopVisible) {
    visibleCards.push(
      <CtaCard
        key="store"
        href={`/${locale}/${dealerSlug}/shop`}
        backgroundSrc={STORE_BG}
        label={dictionary.store}
        icon={<ShoppingBag className="h-6 w-6" aria-hidden="true" />}
      />
    );
  }

  if (preRegVisible) {
    visibleCards.push(
      <CtaCard
        key="prereg"
        href={`/${locale}/${dealerSlug}/${preRegPath}`}
        backgroundSrc={PRE_REG_BG}
        label={dictionary.preReg}
        icon={<ClipboardList className="h-6 w-6" aria-hidden="true" />}
        iconBadgeClass="bg-secondary"
        accentClass="bg-secondary"
      />
    );
  }

  if (visibleCards.length === 0) return null;

  return (
    <section className="w-full">
      <div className={`flex flex-col ${visibleCards.length > 1 ? "md:flex-row" : ""}`}>
        {visibleCards}
      </div>
    </section>
  );
}
