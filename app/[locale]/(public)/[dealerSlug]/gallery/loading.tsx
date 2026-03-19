import { Skeleton } from "@/components/ui/skeleton";

export default function GalleryLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-slate-900 py-24 px-4">
        <div className="container mx-auto max-w-5xl space-y-4">
          <Skeleton className="h-6 w-24 bg-slate-700" />
          <Skeleton className="h-14 w-2/3 bg-slate-700" />
          <Skeleton className="h-5 w-1/2 bg-slate-700" />
        </div>
      </div>

      {/* Accent bar */}
      <div className="bg-primary h-1" />

      {/* Gallery grid skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`w-full rounded-xl ${i % 5 === 0 ? "aspect-square" : "aspect-[4/3]"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
