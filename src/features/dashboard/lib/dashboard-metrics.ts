import { appConfig } from "~/app/app-config";
import { isFinalOrderStatus } from "~/features/orders/config/order-policy";
import type { Order } from "~/features/orders/model/order";
import { formatCurrency } from "~/lib/formatters";

export type DashboardMetrics = {
  activeGuests: number;
  pendingOrders: number;
  revenueToday: string;
  completedOrders: number;
  averageOrderValue: string;
};

const hotelDateFormatter = new Intl.DateTimeFormat(appConfig.locale, {
  day: "2-digit",
  month: "2-digit",
  timeZone: appConfig.hotel.timeZone,
  year: "numeric",
});

function isOnHotelDate(value: string | Date, date: Date) {
  return (
    hotelDateFormatter.format(new Date(value)) ===
    hotelDateFormatter.format(date)
  );
}

export function getDashboardMetrics(
  orders: Order[],
  currentDate: Date = new Date(),
): DashboardMetrics {
  const openOrders = orders.filter(({ status }) => !isFinalOrderStatus(status));
  const paidOrders = orders.filter(
    ({ paymentStatus, status }) =>
      paymentStatus === "Paid" && status !== "Cancelled",
  );
  const ordersToday = orders.filter((order) =>
    isOnHotelDate(order.orderTime, currentDate),
  );
  const revenueToday = ordersToday
    .filter(
      ({ paymentStatus, status }) =>
        paymentStatus === "Paid" && status !== "Cancelled",
    )
    .reduce((total, order) => total + order.amount, 0);
  const paidRevenue = paidOrders.reduce(
    (total, order) => total + order.amount,
    0,
  );

  return {
    activeGuests: new Set(openOrders.map(({ guestName }) => guestName)).size,
    pendingOrders: openOrders.length,
    revenueToday: formatCurrency(revenueToday),
    completedOrders: ordersToday.filter(({ status }) => status === "Completed")
      .length,
    averageOrderValue: formatCurrency(
      paidOrders.length > 0 ? paidRevenue / paidOrders.length : 0,
    ),
  };
}
