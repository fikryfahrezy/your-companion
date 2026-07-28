import {
  EmptyOrdersState,
  PageLoadingState,
  QueryErrorState,
} from "~/components/feedback/query-state";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { OrderDetailsSheet } from "~/features/orders/components/order-details-sheet";
import { OrdersFilters } from "~/features/orders/components/orders-filters";
import { OrdersList } from "~/features/orders/components/orders-list";
import { OrdersPageHeader } from "~/features/orders/components/orders-page-header";
import { OrdersPagination } from "~/features/orders/components/orders-pagination";
import { useOrdersPage } from "~/features/orders/hooks/use-orders-page";

export function OrdersPage() {
  const orders = useOrdersPage();

  if (orders.isPending) return <PageLoadingState />;

  if (orders.isError) {
    return (
      <QueryErrorState
        message={orders.errorMessage ?? "The orders could not be loaded."}
        onRestore={orders.restoreData}
        onRetry={orders.retry}
      />
    );
  }

  if (!orders.pagination) return null;

  return (
    <div className="space-y-5">
      <OrdersPageHeader total={orders.pagination.total} />

      <Card className="rounded-xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>All orders</CardTitle>
            <span className="text-xs text-muted-foreground">
              Showing {orders.firstResult}–{orders.lastResult} of{" "}
              {orders.pagination.total}
            </span>
          </div>
        </CardHeader>

        <OrdersFilters
          filters={orders.filters}
          onChange={orders.updateFilterParam}
          onClear={orders.clearFilters}
        />

        <CardContent
          className="px-0 transition-opacity"
          aria-busy={orders.isFetching}
        >
          {orders.pagination.items.length > 0 ? (
            <OrdersList
              orders={orders.pagination.items}
              search={orders.search}
            />
          ) : (
            <EmptyOrdersState onClear={orders.clearFilters} />
          )}
        </CardContent>

        <OrdersPagination
          isFetching={orders.isFetching}
          onPageChange={orders.setPage}
          onPageSizeChange={orders.setPageSize}
          pagination={orders.pagination}
        />
      </Card>

      <OrderDetailsSheet
        onClose={orders.closeDetails}
        isLoading={orders.isDetailLoading}
        order={orders.selectedOrder}
        requestedOrderId={orders.orderId}
      />
    </div>
  );
}
