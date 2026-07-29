import { expect, test } from "@playwright/test";

test("starts signed out, protects return paths, and signs staff in", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Staff sign in" }),
  ).toBeVisible();

  await page.goto("/orders");
  await expect(page).toHaveURL(/\/login\?returnTo=%2Forders$/);

  await page.getByLabel("Password").fill("incorrect");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("alert")).toContainText(
    "The email or password is incorrect.",
  );

  await page.getByLabel("Password").fill("companion123");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/orders$/);
  await expect(
    page.getByRole("heading", { name: "Guest orders" }),
  ).toBeVisible();
});
