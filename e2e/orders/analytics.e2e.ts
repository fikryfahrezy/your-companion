import { expect, test } from "@playwright/test";

type CapturedEvent = {
  control?: string;
  name: string;
  path?: string;
  value?: string;
};

test("tracks navigation and order-management controls", async ({ page }) => {
  await page.addInitScript(() => {
    const capturedEvents: CapturedEvent[] = [];
    Object.assign(window, { __cmpnionEvents: capturedEvents });
    window.addEventListener("cmpnion:analytics", (browserEvent) => {
      capturedEvents.push((browserEvent as CustomEvent<CapturedEvent>).detail);
    });
  });

  await page.goto("/orders");
  await page.getByRole("searchbox", { name: "Search orders" }).fill("John");

  await expect
    .poll(() =>
      page.evaluate(() => {
        const events = (
          window as typeof window & { __cmpnionEvents: CapturedEvent[] }
        ).__cmpnionEvents;

        return {
          trackedOrderSearch: events.some(
            (event) =>
              event.name === "orders_control_changed" &&
              event.control === "search" &&
              event.value === "John",
          ),
          trackedPageView: events.some(
            (event) => event.name === "page_viewed" && event.path === "/orders",
          ),
        };
      }),
    )
    .toEqual({ trackedOrderSearch: true, trackedPageView: true });
});
