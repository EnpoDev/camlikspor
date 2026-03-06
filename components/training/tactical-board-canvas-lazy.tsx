"use client";

import dynamic from "next/dynamic";
import { PageLoader } from "@/components/ui/page-loader";

const TacticalBoardCanvas = dynamic(
  () => import("@/components/training/tactical-board-canvas").then((mod) => ({ default: mod.TacticalBoardCanvas })),
  {
    loading: () => <PageLoader text="Taktik tahtası yükleniyor..." />,
    ssr: false,
  }
);

export { TacticalBoardCanvas };
