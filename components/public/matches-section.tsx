"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, Ticket } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type MatchStatus = "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
type SponsorTier = "main" | "official" | "partner";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: Date | string;
  venue: string | null;
  competition: string | null;
  status: MatchStatus;
  homeTeamLogo: string | null;
  awayTeamLogo: string | null;
  ticketUrl?: string | null;
}

interface Sponsor {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  tier: SponsorTier;
}

interface MatchesSectionProps {
  matches: Match[];
  sponsors?: Sponsor[];
  isVisible: boolean;
  dictionary: {
    title: string;
    matchTickets: string;
    tbd: string;
  };
}

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: Date | string): Countdown | null {
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculate = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setCountdown(null);
        return;
      }

      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return countdown;
}

function TeamCrest({
  logo,
  name,
}: {
  logo: string | null;
  name: string;
}) {
  if (logo) {
    return (
      <div className="relative w-16 h-16 md:w-20 md:h-20">
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain drop-shadow-md"
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg select-none"
      aria-label={name}
      role="img"
    >
      <span aria-hidden="true">{initials}</span>
    </div>
  );
}

function CountdownDisplay({
  countdown,
  tbd,
}: {
  countdown: Countdown | null;
  tbd: string;
}) {
  if (!countdown) {
    return (
      <span className="text-2xl md:text-3xl font-black text-primary tracking-widest">
        {tbd}
      </span>
    );
  }

  if (countdown.days > 0) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-black text-primary leading-none">
          {countdown.days}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
          gün
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 font-mono">
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-black text-primary leading-none">
          {String(countdown.hours).padStart(2, "0")}
        </span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
          sa
        </span>
      </div>
      <span className="text-primary font-black text-xl pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-black text-primary leading-none">
          {String(countdown.minutes).padStart(2, "0")}
        </span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
          dk
        </span>
      </div>
      <span className="text-primary font-black text-xl pb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-xl md:text-2xl font-black text-slate-900 leading-none tabular-nums">
          {String(countdown.seconds).padStart(2, "0")}
        </span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
          sn
        </span>
      </div>
    </div>
  );
}

function ScoreDisplay({
  homeScore,
  awayScore,
  status,
}: {
  homeScore: number | null;
  awayScore: number | null;
  status: string;
}) {
  if (status === "COMPLETED" && homeScore !== null && awayScore !== null) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-3xl md:text-4xl font-black text-slate-900 leading-none tabular-nums">
          {homeScore} - {awayScore}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
          Sonuç
        </span>
      </div>
    );
  }

  if (status === "LIVE" && homeScore !== null && awayScore !== null) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-1" aria-label="Canlı maç">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest" aria-hidden="true">
            Canlı
          </span>
        </div>
        <span className="text-3xl md:text-4xl font-black text-slate-900 leading-none tabular-nums">
          {homeScore} - {awayScore}
        </span>
      </div>
    );
  }

  return null;
}

function MatchCard({
  match,
  dictionary,
}: {
  match: Match;
  dictionary: MatchesSectionProps["dictionary"];
}) {
  const countdown = useCountdown(match.matchDate);
  const matchDate = new Date(match.matchDate);
  const isUpcoming = match.status === "UPCOMING";
  const isCompleted = match.status === "COMPLETED";

  return (
    <div className="flex-shrink-0 w-[300px] md:w-auto bg-white border border-slate-200 border-t-2 border-t-primary rounded-2xl overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      {/* Top bar: date + competition + status badge */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{format(matchDate, "d MMM yyyy · HH:mm", { locale: tr })}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {match.status === "UPCOMING" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Yaklaşan
            </span>
          )}
          {match.status === "LIVE" && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-600">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Canlı
            </span>
          )}
          {match.status === "COMPLETED" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
              Tamamlandı
            </span>
          )}
          {match.status === "CANCELLED" && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-500">
              İptal
            </span>
          )}
          {match.competition && (
            <div className="flex items-center gap-1 text-primary/80 text-xs font-medium">
              <Trophy className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate max-w-[80px]">{match.competition}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main match area */}
      <div className="px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <TeamCrest logo={match.homeTeamLogo} name={match.homeTeam} />
            <span className="text-slate-900 text-sm font-semibold text-center leading-tight line-clamp-2">
              {match.homeTeam}
            </span>
          </div>

          {/* Center: score or countdown */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 px-2">
            {isCompleted || match.status === "LIVE" ? (
              <ScoreDisplay
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                status={match.status}
              />
            ) : (
              <CountdownDisplay countdown={countdown} tbd={dictionary.tbd} />
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <TeamCrest logo={match.awayTeamLogo} name={match.awayTeam} />
            <span className="text-slate-900 text-sm font-semibold text-center leading-tight line-clamp-2">
              {match.awayTeam}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom: venue + ticket button */}
      <div className="px-5 pb-4 space-y-3">
        {match.venue && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{match.venue}</span>
          </div>
        )}
        {isUpcoming && match.ticketUrl && (
          <Link
            href={match.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${dictionary.matchTickets} – ${match.homeTeam} - ${match.awayTeam}`}
          >
            <Button size="sm" className="w-full gap-1.5">
              <Ticket className="h-3.5 w-3.5" aria-hidden="true" />
              {dictionary.matchTickets}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

function SponsorMarquee({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null;

  // Duplicate for seamless loop
  const items = [...sponsors, ...sponsors];

  return (
    <div className="mt-12 border-t border-slate-200 pt-8">
      <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-[0.25em] mb-6">
        Sponsorlar
      </p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex items-center gap-12 animate-marquee">
          {items.map((sponsor, i) => {
            const logo = sponsor.logoUrl ? (
              <div className="relative h-14 w-36 flex-shrink-0">
                <Image
                  src={sponsor.logoUrl}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-slate-600 text-sm font-bold whitespace-nowrap px-4 py-2 bg-slate-100 rounded-lg">
                {sponsor.name}
              </span>
            );

            return sponsor.websiteUrl ? (
              <Link
                key={`${sponsor.id}-${i}`}
                href={sponsor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 hover:opacity-80 transition-opacity"
              >
                {logo}
              </Link>
            ) : (
              <div key={`${sponsor.id}-${i}`} className="flex-shrink-0">
                {logo}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MatchesSection({
  matches,
  sponsors = [],
  isVisible,
  dictionary,
}: MatchesSectionProps) {
  if (!isVisible || matches.length === 0) return null;

  const gridCols =
    matches.length === 1
      ? "md:grid-cols-1 md:max-w-sm"
      : matches.length === 2
      ? "md:grid-cols-2 md:max-w-2xl"
      : "md:grid-cols-3";

  return (
    <section className="py-20 bg-white border-t border-slate-200">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-primary" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">
                Fikstür
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              {dictionary.title}
            </h2>
          </div>

          {/* Cards row — scrollable on mobile, grid on desktop */}
          <div className={`flex md:grid ${gridCols} gap-4 overflow-x-auto pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide`}>
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} dictionary={dictionary} />
            ))}
          </div>

          {/* Sponsor marquee */}
          <SponsorMarquee sponsors={sponsors} />
        </div>
      </div>
    </section>
  );
}
