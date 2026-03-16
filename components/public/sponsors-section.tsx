import Image from "next/image";
import Link from "next/link";

type SponsorTier = "main" | "official" | "partner";

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  tier: SponsorTier;
}

interface SponsorsSectionProps {
  sponsors: Sponsor[];
  isVisible: boolean;
  dictionary: {
    title: string;
    mainPartners: string;
    officialPartners: string;
    partners: string;
  };
}

interface SponsorLogoProps {
  sponsor: Sponsor;
  size: "lg" | "md" | "sm";
}

function SponsorLogo({ sponsor, size }: SponsorLogoProps) {
  const sizeClasses = {
    lg: "h-20 w-48",
    md: "h-14 w-36",
    sm: "h-10 w-28",
  };

  const inner = (
    <div
      className={`${sizeClasses[size]} relative flex items-center justify-center opacity-80 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300`}
    >
      {sponsor.logoUrl ? (
        <Image
          src={sponsor.logoUrl}
          alt={sponsor.name}
          fill
          className="object-contain"
          sizes={size === "lg" ? "192px" : size === "md" ? "144px" : "112px"}
        />
      ) : (
        <span
          className={`font-bold text-slate-600 text-center leading-tight ${
            size === "lg" ? "text-base" : size === "md" ? "text-sm" : "text-xs"
          }`}
        >
          {sponsor.name}
        </span>
      )}
    </div>
  );

  if (sponsor.websiteUrl) {
    return (
      <Link
        href={sponsor.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center"
        aria-label={`${sponsor.name} web sitesini ziyaret et (yeni sekmede açılır)`}
      >
        {inner}
      </Link>
    );
  }

  return <div className="inline-flex items-center justify-center">{inner}</div>;
}

interface TierRowProps {
  label: string;
  sponsors: Sponsor[];
  size: "lg" | "md" | "sm";
  columns: string;
}

function TierRow({ label, sponsors, size, columns }: TierRowProps) {
  if (sponsors.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] whitespace-nowrap">
          {label}
        </span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className={`grid ${columns} place-items-center gap-8`}>
        {sponsors.map((sponsor) => (
          <SponsorLogo key={sponsor.id} sponsor={sponsor} size={size} />
        ))}
      </div>
    </div>
  );
}

export function SponsorsSection({
  sponsors,
  isVisible,
  dictionary,
}: SponsorsSectionProps) {
  if (!isVisible || sponsors.length === 0) return null;

  const mainSponsors = sponsors.filter((s) => s.tier === "main");
  const officialSponsors = sponsors.filter((s) => s.tier === "official");
  const partnerSponsors = sponsors.filter((s) => s.tier === "partner");

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-slate-300" />
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                {dictionary.title}
              </h2>
              <span className="h-px w-10 bg-slate-300" />
            </div>
          </div>

          {/* Tier rows */}
          <div className="space-y-14">
            <TierRow
              label={dictionary.mainPartners}
              sponsors={mainSponsors}
              size="lg"
              columns="grid-cols-2 md:grid-cols-3"
            />
            <TierRow
              label={dictionary.officialPartners}
              sponsors={officialSponsors}
              size="md"
              columns="grid-cols-3 md:grid-cols-4"
            />
            <TierRow
              label={dictionary.partners}
              sponsors={partnerSponsors}
              size="sm"
              columns="grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
