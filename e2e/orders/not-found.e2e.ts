import { expect, test } from "@playwright/test";

test("handles a missing order and returns to the orders list", async ({
  page,
}) => {
  await page.goto("/orders/ORD-9999");
  const details = page.getByRole("dialog");

  await expect(
    details.getByRole("heading", { name: "Order not found" }),
  ).toBeVisible();
  await expect(details.getByText(/ORD-9999/)).toBeVisible();

  await details.getByRole("button", { name: "Back to orders" }).click();

  await expect(page).toHaveURL(/\/orders$/);
  await expect(details).toBeHidden();
});
