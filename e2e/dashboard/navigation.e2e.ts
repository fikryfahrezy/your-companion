import { expect, test } from "@playwright/test";

test("navigates from the dashboard to order management", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Good afternoon, Alex" }),
  ).toBeVisible();
  await expect(
    page.getByText("Operations overview", { exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Orders", exact: true }).click();

  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByRole("heading", { name: "Guest orders" }),
  ).toBeVisible();
  await expect(page.getByText("Showing 1–8 of 14")).toBeVisible();
});
