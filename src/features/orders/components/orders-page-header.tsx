import { Badge } from "~/components/ui/badge";

export function OrdersPageHeader({ total }: { total: number }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight md:text-3xl">
            Guest orders
          </h1>
          <Badge variant="secondary">{total}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Find, review, and move service requests through their lifecycle.
        </p>
      </div>
    </div>
  );
}
