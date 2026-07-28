import { PaginationControls } from "~/components/navigation/pagination-controls";
import { ORDER_LIST_CONFIG } from "~/features/orders/config/order-policy";
import type { PaginatedOrders } from "~/features/orders/model/order";

export function OrdersPagination({
  isFetching,
  onPageChange,
  onPageSizeChange,
  pagination,
}: {
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pagination: PaginatedOrders;
}) {
  return (
    <PaginationControls
      disabled={isFetching}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={ORDER_LIST_CONFIG.pageSizes}
      pagination={pagination}
    />
  );
}
