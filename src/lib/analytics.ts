export const analyticsBrowserEventName = "cmpnion:analytics";

type AnalyticsEventInput =
  | { name: "page_viewed"; path: string }
  | {
      name: "orders_control_changed";
      control: "search" | "status" | "service" | "sort";
      value: string;
    }
  | { name: "orders_filters_cleared" }
  | { name: "orders_page_changed"; page: number }
  | { name: "orders_page_size_changed"; pageSize: number }
  | {
      name: "order_status_update_started";
      orderId: string;
      status: string;
    }
  | {
      name: "order_status_update_succeeded";
      orderId: string;
      status: string;
    }
  | {
      name: "order_status_update_failed";
      error: string;
      orderId: string;
      status: string;
    }
  | { name: "realtime_order_received"; orderId: string }
  | { name: "realtime_order_failed"; error: string }
  | { name: "user_signed_in"; userId: string }
  | { name: "user_signed_out" };

export type AnalyticsEvent = AnalyticsEventInput & {
  id: string;
  occurredAt: string;
};

type AnalyticsListener = (event: AnalyticsEvent) => void;

const listeners = new Set<AnalyticsListener>();

/**
 * Emits a typed event to registered adapters and to the browser. A production
 * analytics SDK can subscribe without coupling feature code to one vendor.
 */
export function trackEvent<T extends AnalyticsEventInput>(input: T) {
  const event: T & Pick<AnalyticsEvent, "id" | "occurredAt"> = {
    ...input,
    id: crypto.randomUUID(),
    occurredAt: new Date().toISOString(),
  };

  listeners.forEach((listener) => {
    try {
      listener(event);
    } catch (error) {
      console.error("Analytics subscriber failed.", error);
    }
  });

  if (import.meta.env.DEV) {
    console.log("[CMPNION analytics]", event);
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<AnalyticsEvent>(analyticsBrowserEventName, {
        detail: event,
      }),
    );
  }

  return event;
}

export function subscribeToAnalytics(listener: AnalyticsListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
