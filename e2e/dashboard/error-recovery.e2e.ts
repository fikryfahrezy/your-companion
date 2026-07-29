import { expect, test } from "../fixtures";

test("restores the dashboard after a simulated API failure", async ({
  page,
}) => {
  await page.goto("/?apiError=true");

  await expect(
    page.getByRole("heading", { name: "Unable to load orders" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Restore data" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Good afternoon, Alex" }),
  ).toBeVisible();
});
