import { describe, expect, test } from "bun:test";
import {
  getPageTitle,
  isNavigationItemActive,
  navigationItems,
} from "~/app/route-registry";

describe("app route registry", () => {
  test("provides navigation from registered route metadata", () => {
    expect(navigationItems.map(({ label, to }) => ({ label, to }))).toEqual([
      { label: "Overview", to: "/" },
      { label: "Orders", to: "/orders" },
    ]);
  });

  test("resolves titles for index, list, detail, and fallback routes", () => {
    expect(getPageTitle("/")).toBe("Operations overview");
    expect(getPageTitle("/orders")).toBe("Order management");
    expect(getPageTitle("/orders/ORD-1001")).toBe("Order management");
    expect(getPageTitle("/missing-page")).toBe("Page not found");
  });

  test("keeps parent navigation active for detail routes only", () => {
    const ordersNavigation = navigationItems.find(({ to }) => to === "/orders");

    expect(ordersNavigation).toBeDefined();
    expect(isNavigationItemActive(ordersNavigation!, "/orders/ORD-1001")).toBe(
      true,
    );
    expect(isNavigationItemActive(ordersNavigation!, "/orders-archive")).toBe(
      false,
    );
  });
});
