"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ShopSearchProps {
  basePath: string;
  defaultValue?: string;
}

export function ShopSearch({ basePath, defaultValue = "" }: ShopSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`${basePath}?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(basePath);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ürün ara..."
          className="pl-10 bg-slate-50 dark:bg-slate-800 border-0"
        />
      </div>
    </form>
  );
}
