import { describe, expect, test } from "bun:test";
import { subscribeToAnalytics, trackEvent } from "~/lib/analytics";

describe("analytics", () => {
  test("emits structured events to registered adapters", () => {
    const received: string[] = [];
    const unsubscribe = subscribeToAnalytics((event) => {
      received.push(event.name);
    });

    const event = trackEvent({ name: "page_viewed", path: "/orders" });
    unsubscribe();
    trackEvent({ name: "orders_filters_cleared" });

    expect(received).toEqual(["page_viewed"]);
    expect(event.id).toBeTruthy();
    expect(event.occurredAt).toBeTruthy();
    expect(event.path).toBe("/orders");
  });
});
