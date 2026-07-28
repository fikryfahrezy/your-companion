import { HugeiconsIcon } from "@hugeicons/react";
import {
  Alert02Icon,
  RefreshIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function PageLoadingState() {
  return (
    <div className="space-y-5" aria-label="Loading dashboard" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton className="h-32 rounded-xl" key={index} />
        ))}
      </div>
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );
}

export function QueryErrorState({
  message,
  onRetry,
  onRestore,
}: {
  message: string;
  onRetry: () => void;
  onRestore?: () => void;
}) {
  return (
    <Card className="rounded-xl border-destructive/20 py-12">
      <CardContent className="mx-auto flex max-w-md flex-col items-center text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={Alert02Icon} size={22} strokeWidth={2} />
        </span>
        <h2 className="mt-4 font-heading text-lg font-semibold">
          Unable to load orders
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex gap-2">
          {onRestore ? (
            <Button variant="outline" onClick={onRestore}>
              Restore data
            </Button>
          ) : null}
          <Button onClick={onRetry}>
            <HugeiconsIcon data-icon="inline-start" icon={RefreshIcon} />
            Try again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyOrdersState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HugeiconsIcon icon={Search01Icon} size={21} strokeWidth={2} />
      </span>
      <h2 className="mt-4 font-heading text-base font-semibold">
        No orders found
      </h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Try changing your search or clearing one of the active filters.
      </p>
      <Button className="mt-5" variant="outline" onClick={onClear}>
        Clear search and filters
      </Button>
    </div>
  );
}
