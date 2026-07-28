import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { PaginationMetadata } from "~/lib/pagination";

export function PaginationControls({
  disabled = false,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  pagination,
}: {
  disabled?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions: readonly number[];
  pagination: PaginationMetadata;
}) {
  if (pagination.total === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Rows per page</span>
        <Select
          onValueChange={(value) => {
            if (value) onPageSizeChange(Number(value));
          }}
          value={String(pagination.pageSize)}
        >
          <SelectTrigger
            className="w-16 rounded-lg"
            size="sm"
            aria-label="Rows per page"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground sm:ml-auto">
        Page {pagination.page} of {pagination.totalPages}
      </p>
      <div className="flex gap-1">
        <Button
          aria-label="Previous page"
          disabled={pagination.page <= 1 || disabled}
          onClick={() => onPageChange(pagination.page - 1)}
          size="icon-sm"
          variant="outline"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Button>
        <Button
          aria-label="Next page"
          disabled={pagination.page >= pagination.totalPages || disabled}
          onClick={() => onPageChange(pagination.page + 1)}
          size="icon-sm"
          variant="outline"
        >
          <HugeiconsIcon icon={ArrowRight01Icon} />
        </Button>
      </div>
    </div>
  );
}
