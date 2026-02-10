"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ShopPriceFilterProps {
  basePath: string;
  currentParams: string;
  defaultMin?: string;
  defaultMax?: string;
}

export function ShopPriceFilter({
  basePath,
  currentParams,
  defaultMin = "",
  defaultMax = "",
}: ShopPriceFilterProps) {
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(currentParams);

    if (min.trim()) {
      params.set("minPrice", min.trim());
    } else {
      params.delete("minPrice");
    }

    if (max.trim()) {
      params.set("maxPrice", max.trim());
    } else {
      params.delete("maxPrice");
    }

    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const handleClear = () => {
    setMin("");
    setMax("");
    const params = new URLSearchParams(currentParams);
    params.delete("minPrice");
    params.delete("maxPrice");
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const hasFilter = defaultMin || defaultMax;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <Filter className="h-5 w-5 text-emerald-600" />
        <h2 className="font-bold text-lg">Fiyat Aralığı</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min ₺"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-0"
            min="0"
          />
          <Input
            type="number"
            placeholder="Max ₺"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border-0"
            min="0"
          />
        </div>
        <Button type="submit" variant="outline" className="w-full">
          Filtrele
        </Button>
        {hasFilter && (
          <Button type="button" variant="ghost" className="w-full text-sm" onClick={handleClear}>
            Filtreyi Temizle
          </Button>
        )}
      </form>
    </div>
  );
}
