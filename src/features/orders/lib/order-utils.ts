import type {
  OrderStatus,
  PaymentStatus,
  ServiceType,
} from "~/features/orders/model/order";

export const statusStyles: Record<OrderStatus, string> = {
  New: "border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
  Acknowledged:
    "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300",
  "In Progress":
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  Completed:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  Cancelled:
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export const statusIndicatorStyles: Record<OrderStatus, string> = {
  New: "bg-cyan-500",
  Acknowledged: "bg-blue-600 dark:bg-blue-500",
  "In Progress": "bg-amber-500",
  Completed: "bg-emerald-600 dark:bg-emerald-500",
  Cancelled: "bg-slate-400",
};

export const paymentStyles: Record<PaymentStatus, string> = {
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  Failed:
    "border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/20",
};

export const serviceColors: Record<ServiceType, string> = {
  "Room Service": "bg-chart-5",
  Housekeeping: "bg-chart-4",
  Laundry: "bg-chart-3",
  "Extra Bed": "bg-chart-2",
  "Spa & Massage": "bg-chart-1",
};
