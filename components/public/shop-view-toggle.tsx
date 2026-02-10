"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Grid3X3, LayoutGrid } from "lucide-react";

type ViewMode = "cols-3" | "cols-2";

interface ShopViewToggleProps {
  children: React.ReactNode;
  productCount: number;
  label: string;
}

export function ShopViewToggle({ children, productCount, label }: ShopViewToggleProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("cols-3");

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-lg">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{productCount}</span>{" "}
          {label}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant={viewMode === "cols-3" ? "default" : "ghost"}
            size="icon"
            className="hidden md:flex"
            onClick={() => setViewMode("cols-3")}
          >
            <Grid3X3 className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "cols-2" ? "default" : "ghost"}
            size="icon"
            className="hidden md:flex"
            onClick={() => setViewMode("cols-2")}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div
        className={
          viewMode === "cols-3"
            ? "grid gap-6 grid-cols-2 md:grid-cols-3"
            : "grid gap-6 grid-cols-1 md:grid-cols-2"
        }
      >
        {children}
      </div>
    </>
  );
}
