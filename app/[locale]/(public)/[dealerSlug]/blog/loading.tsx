import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
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

      {/* Blog card grid skeleton */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-56" />
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-9 w-32 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
