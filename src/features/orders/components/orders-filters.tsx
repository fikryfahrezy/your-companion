import {
  Cancel01Icon,
  FilterIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  orderStatuses,
  serviceTypes,
  type OrderControlKey,
  type OrderSortDirection,
  type OrderStatus,
  type ServiceType,
} from "~/features/orders/model/order";

export type OrdersFilterValues = {
  hasActiveFilters: boolean;
  rawSearch: string;
  serviceFilter: ServiceType | "all";
  sortDirection: OrderSortDirection;
  statusFilter: OrderStatus | "all";
};

export function OrdersFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: OrdersFilterValues;
  onChange: (
    key: OrderControlKey,
    value: string,
    defaultValue?: string,
  ) => void;
  onClear: () => void;
}) {
  return (
    <div className="grid gap-3 border-b p-4 md:grid-cols-[minmax(220px,1fr)_180px_190px_140px_auto]">
      <label className="relative block">
        <span className="sr-only">Search orders</span>
        <HugeiconsIcon
          className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-muted-foreground"
          icon={Search01Icon}
          size={15}
        />
        <Input
          className="rounded-lg pl-8"
          onChange={(event) => onChange("q", event.target.value, "")}
          placeholder="Guest, order ID, or room"
          type="search"
          value={filters.rawSearch}
        />
      </label>

      <Select
        onValueChange={(value) => onChange("status", value ?? "all")}
        value={filters.statusFilter}
      >
        <SelectTrigger
          className="w-full rounded-lg"
          aria-label="Filter by status"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {orderStatuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onChange("service", value ?? "all")}
        value={filters.serviceFilter}
      >
        <SelectTrigger
          className="w-full rounded-lg"
          aria-label="Filter by service"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All services</SelectItem>
          {serviceTypes.map((service) => (
            <SelectItem key={service} value={service}>
              {service}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onChange("sort", value ?? "newest", "newest")}
        value={filters.sortDirection}
      >
        <SelectTrigger className="w-full rounded-lg" aria-label="Sort orders">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="oldest">Oldest first</SelectItem>
        </SelectContent>
      </Select>

      <Button
        className="rounded-lg"
        disabled={!filters.hasActiveFilters}
        onClick={onClear}
        variant="ghost"
      >
        <HugeiconsIcon
          data-icon="inline-start"
          icon={filters.hasActiveFilters ? Cancel01Icon : FilterIcon}
        />
        Clear
      </Button>
    </div>
  );
}
