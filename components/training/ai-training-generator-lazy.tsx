"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AiTrainingGenerator = dynamic(
  () => import("@/components/training/ai-training-generator").then((mod) => ({ default: mod.AiTrainingGenerator })),
  {
    loading: () => (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    ),
    ssr: false,
  }
);

export { AiTrainingGenerator };
