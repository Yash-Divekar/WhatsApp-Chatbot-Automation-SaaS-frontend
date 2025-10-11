import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoader() {
  return (
    <div className="p-8 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
