"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createMatch, updateMatch, type MatchFormState } from "@/lib/actions/matches";
import type { Match } from "@prisma/client";

interface MatchFormProps {
  locale: string;
  match?: Match;
}

const initialState: MatchFormState = {};

function formatDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function MatchForm({ locale, match }: MatchFormProps) {
  const router = useRouter();

  const action = match
    ? updateMatch.bind(null, match.id)
    : createMatch;

  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(match ? "Maç güncellendi" : "Maç oluşturuldu");
      router.push(`/${locale}/matches`);
    } else if (state.messageKey && !state.success && state.messageKey !== "formValidationError") {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  }, [state, match, locale, router]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Home Team */}
        <div className="space-y-2">
          <Label htmlFor="homeTeam">Ev Sahibi Takım *</Label>
          <Input
            id="homeTeam"
            name="homeTeam"
            defaultValue={match?.homeTeam ?? ""}
            placeholder="Örn: Çamlık Spor"
            required
          />
          {state.errors?.homeTeam && (
            <p className="text-sm text-destructive">{state.errors.homeTeam[0]}</p>
          )}
        </div>

        {/* Away Team */}
        <div className="space-y-2">
          <Label htmlFor="awayTeam">Deplasman Takımı *</Label>
          <Input
            id="awayTeam"
            name="awayTeam"
            defaultValue={match?.awayTeam ?? ""}
            placeholder="Örn: Rakip FC"
            required
          />
          {state.errors?.awayTeam && (
            <p className="text-sm text-destructive">{state.errors.awayTeam[0]}</p>
          )}
        </div>

        {/* Match Date */}
        <div className="space-y-2">
          <Label htmlFor="matchDate">Maç Tarihi ve Saati *</Label>
          <Input
            id="matchDate"
            name="matchDate"
            type="datetime-local"
            defaultValue={
              match?.matchDate
                ? formatDateTimeLocal(new Date(match.matchDate))
                : ""
            }
            required
          />
          {state.errors?.matchDate && (
            <p className="text-sm text-destructive">{state.errors.matchDate[0]}</p>
          )}
        </div>

        {/* Venue */}
        <div className="space-y-2">
          <Label htmlFor="venue">Stat / Saha</Label>
          <Input
            id="venue"
            name="venue"
            defaultValue={match?.venue ?? ""}
            placeholder="Örn: Atatürk Olimpiyat Stadı"
          />
        </div>

        {/* Competition */}
        <div className="space-y-2">
          <Label htmlFor="competition">Lig / Organizasyon</Label>
          <Input
            id="competition"
            name="competition"
            defaultValue={match?.competition ?? ""}
            placeholder="Örn: U14 Bölgesel Ligi"
          />
        </div>

        {/* Ticket URL */}
        <div className="space-y-2">
          <Label htmlFor="ticketUrl">Bilet URL</Label>
          <Input
            id="ticketUrl"
            name="ticketUrl"
            type="url"
            defaultValue={match?.ticketUrl ?? ""}
            placeholder="https://bilet.example.com/..."
          />
          {state.errors?.ticketUrl && (
            <p className="text-sm text-destructive">{state.errors.ticketUrl[0]}</p>
          )}
        </div>

        {/* Match Type */}
        <div className="space-y-2">
          <Label htmlFor="matchType">Maç Tipi</Label>
          <Select name="matchType" defaultValue={match?.matchType ?? "HOME"}>
            <SelectTrigger id="matchType">
              <SelectValue placeholder="Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HOME">Ev Sahibi</SelectItem>
              <SelectItem value="AWAY">Deplasman</SelectItem>
              <SelectItem value="NEUTRAL">Tarafsız Saha</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Durum</Label>
          <Select name="status" defaultValue={match?.status ?? "UPCOMING"}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPCOMING">Yaklaşan</SelectItem>
              <SelectItem value="LIVE">Canlı</SelectItem>
              <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
              <SelectItem value="CANCELLED">İptal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Home Score */}
        <div className="space-y-2">
          <Label htmlFor="homeScore">Ev Sahibi Skoru</Label>
          <Input
            id="homeScore"
            name="homeScore"
            type="number"
            min="0"
            defaultValue={match?.homeScore !== null && match?.homeScore !== undefined ? String(match.homeScore) : ""}
            placeholder="0"
          />
        </div>

        {/* Away Score */}
        <div className="space-y-2">
          <Label htmlFor="awayScore">Deplasman Skoru</Label>
          <Input
            id="awayScore"
            name="awayScore"
            type="number"
            min="0"
            defaultValue={match?.awayScore !== null && match?.awayScore !== undefined ? String(match.awayScore) : ""}
            placeholder="0"
          />
        </div>

        {/* Home Team Logo */}
        <div className="space-y-2">
          <Label htmlFor="homeTeamLogo">Ev Sahibi Logo URL</Label>
          <Input
            id="homeTeamLogo"
            name="homeTeamLogo"
            type="url"
            defaultValue={match?.homeTeamLogo ?? ""}
            placeholder="https://..."
          />
        </div>

        {/* Away Team Logo */}
        <div className="space-y-2">
          <Label htmlFor="awayTeamLogo">Deplasman Logo URL</Label>
          <Input
            id="awayTeamLogo"
            name="awayTeamLogo"
            type="url"
            defaultValue={match?.awayTeamLogo ?? ""}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Switch
          id="isVisible"
          name="isVisible"
          defaultChecked={match?.isVisible ?? true}
          onCheckedChange={(checked) => {
            const input = document.querySelector<HTMLInputElement>('input[name="isVisible"]');
            if (input) input.value = checked ? "true" : "false";
          }}
        />
        <div>
          <Label htmlFor="isVisible" className="cursor-pointer font-medium">
            Görünür
          </Label>
          <p className="text-sm text-muted-foreground">
            Açıksa bu maç herkese açık sayfada gösterilir
          </p>
        </div>
        <input type="hidden" name="isVisible" defaultValue={match?.isVisible !== false ? "true" : "false"} />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Kaydediliyor..." : match ? "Güncelle" : "Oluştur"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/matches`)}
        >
          İptal
        </Button>
      </div>
    </form>
  );
}
