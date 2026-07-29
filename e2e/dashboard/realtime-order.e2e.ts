import { expect, test } from "../fixtures";

test("receives recurring simulated orders and surfaces notifications", async ({
  page,
}) => {
  await page.goto("/");

  const notifications = page.getByLabel("Notifications");
  await expect(
    notifications.getByText("New order received", { exact: true }),
  ).toBeVisible({ timeout: 10_000 });
  await expect(notifications).toContainText("ORD-1015 · Nadia Putri, Room 608");
  await expect(notifications).toContainText(
    "ORD-1016 · Nadia Putri, Room 608",
    { timeout: 7_000 },
  );

  await page.getByRole("link", { name: "Orders", exact: true }).click();
  await page.getByRole("searchbox", { name: "Search orders" }).fill("ORD-1016");

  const ordersTable = page.getByRole("table", {
    name: "Guest service orders",
  });
  await expect(ordersTable).toContainText("Nadia Putri");
  await expect(ordersTable).toContainText("Room 608");
});
