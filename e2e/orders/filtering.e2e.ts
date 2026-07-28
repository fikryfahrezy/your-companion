import { expect, test } from "@playwright/test";

test("filters orders and keeps filter state in the URL", async ({ page }) => {
  await page.goto("/orders");
  const ordersTable = page.getByRole("table", {
    name: "Guest service orders",
  });

  await page
    .getByRole("searchbox", { name: "Search orders" })
    .fill("John Smith");

  await expect(page).toHaveURL(/q=John(?:\+|%20)Smith/);
  await expect(
    ordersTable.getByRole("row").filter({ hasText: "John Smith" }),
  ).toHaveCount(1);
  await expect(ordersTable.locator("tbody tr")).toHaveCount(1);

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page).toHaveURL(/\/orders$/);

  await page.getByRole("combobox", { name: "Filter by status" }).click();
  await page.getByRole("option", { name: "Completed", exact: true }).click();

  await expect(page).toHaveURL(/status=Completed/);
  await expect(ordersTable.locator("tbody tr")).toHaveCount(4);
});

test("filters by service and sorts the filtered results", async ({ page }) => {
  await page.goto("/orders");
  const ordersTable = page.getByRole("table", {
    name: "Guest service orders",
  });

  await page.getByRole("combobox", { name: "Filter by service" }).click();
  await page.getByRole("option", { name: "Room Service" }).click();

  await expect(page).toHaveURL(/service=Room(?:\+|%20)Service/);
  await expect(ordersTable.locator("tbody tr")).toHaveCount(3);

  await page.getByRole("combobox", { name: "Sort orders" }).click();
  await page.getByRole("option", { name: "Oldest first" }).click();

  await expect(page).toHaveURL(/sort=oldest/);
  await expect(ordersTable.locator("tbody tr").first()).toContainText(
    "ORD-1012",
  );
});

test("shows and clears the empty search state", async ({ page }) => {
  await page.goto("/orders");

  await page
    .getByRole("searchbox", { name: "Search orders" })
    .fill("missing guest");

  await expect(
    page.getByRole("heading", { name: "No orders found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear search and filters" }).click();

  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByRole("table", { name: "Guest service orders" }),
  ).toBeVisible();
});
