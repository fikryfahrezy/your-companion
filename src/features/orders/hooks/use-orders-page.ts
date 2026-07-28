import { useCallback, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  orderDetailQueryOptions,
  ordersQueryOptions,
} from "~/features/orders/api/orders-queries";
import { ORDER_LIST_CONFIG } from "~/features/orders/config/order-policy";
import {
  orderSortDirections,
  orderStatuses,
  serviceTypes,
  type OrderControlKey,
} from "~/features/orders/model/order";
import { useUrlSearchParams } from "~/hooks/use-url-search-params";
import { trackEvent } from "~/lib/analytics";
import { getPaginationRange } from "~/lib/pagination";
import {
  parseAllowedIntegerParam,
  parseBooleanParam,
  parsePositiveIntegerParam,
  parseStringParam,
} from "~/lib/search-params";

const filterFallback = "all" as const;

export function useOrdersPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { removeSearchParams, searchParams, updateSearchParam } =
    useUrlSearchParams();
  const rawSearch = searchParams.get("q") ?? "";
  const deferredSearch = useDeferredValue(rawSearch.trim());
  const statusFilter = parseStringParam(
    searchParams.get("status"),
    orderStatuses,
    filterFallback,
  );
  const serviceFilter = parseStringParam(
    searchParams.get("service"),
    serviceTypes,
    filterFallback,
  );
  const sortDirection = parseStringParam(
    searchParams.get("sort"),
    orderSortDirections,
    "newest",
  );
  const page = parsePositiveIntegerParam(searchParams.get("page"), 1);
  const pageSize = parseAllowedIntegerParam(
    searchParams.get("pageSize"),
    ORDER_LIST_CONFIG.pageSizes,
    ORDER_LIST_CONFIG.defaultPageSize,
  );
  const simulateError = parseBooleanParam(searchParams.get("apiError"));

  const ordersQuery = useQuery(
    ordersQueryOptions({
      page,
      pageSize,
      q: deferredSearch || undefined,
      service: serviceFilter === "all" ? undefined : serviceFilter,
      simulateError,
      sort: sortDirection,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
  );
  const orderFromCurrentPage = ordersQuery.data?.items.find(
    ({ id }) => id === orderId,
  );
  const orderDetailQuery = useQuery({
    ...orderDetailQueryOptions(orderId ?? ""),
    enabled: Boolean(orderId && !orderFromCurrentPage),
  });

  const updateFilterParam = useCallback(
    (
      key: OrderControlKey,
      value: string,
      defaultValue: string = filterFallback,
    ) => {
      trackEvent({
        name: "orders_control_changed",
        control: key === "q" ? "search" : key,
        value,
      });
      updateSearchParam(key, value, { defaultValue, remove: ["page"] });
    },
    [updateSearchParam],
  );

  const clearFilters = useCallback(() => {
    trackEvent({ name: "orders_filters_cleared" });
    removeSearchParams(["q", "status", "service", "page"]);
  }, [removeSearchParams]);

  const closeDetails = useCallback(() => {
    void navigate(
      { pathname: "/orders", search: searchParams.toString() },
      { replace: true },
    );
  }, [navigate, searchParams]);

  const pagination = ordersQuery.data;
  const paginationRange = pagination
    ? getPaginationRange(pagination)
    : { first: 0, last: 0 };
  const selectedOrder = orderFromCurrentPage ?? orderDetailQuery.data;

  return {
    clearFilters,
    closeDetails,
    errorMessage: ordersQuery.error?.message,
    filters: {
      hasActiveFilters:
        Boolean(rawSearch) || statusFilter !== "all" || serviceFilter !== "all",
      rawSearch,
      serviceFilter,
      sortDirection,
      statusFilter,
    },
    firstResult: paginationRange.first,
    isDetailLoading: Boolean(
      orderId && !selectedOrder && orderDetailQuery.isPending,
    ),
    isError: ordersQuery.isError,
    isFetching: ordersQuery.isFetching,
    isPending: ordersQuery.isPending,
    lastResult: paginationRange.last,
    orderId,
    pagination,
    restoreData: simulateError
      ? () => removeSearchParams(["apiError"])
      : undefined,
    retry: () => void ordersQuery.refetch(),
    search: searchParams.toString(),
    selectedOrder,
    setPage: (nextPage: number) => {
      trackEvent({ name: "orders_page_changed", page: nextPage });
      updateSearchParam("page", String(nextPage), { defaultValue: "1" });
    },
    setPageSize: (nextPageSize: number) => {
      trackEvent({
        name: "orders_page_size_changed",
        pageSize: nextPageSize,
      });
      updateSearchParam("pageSize", String(nextPageSize), {
        defaultValue: String(ORDER_LIST_CONFIG.defaultPageSize),
        remove: ["page"],
      });
    },
    updateFilterParam,
  };
}
