import { expect, type Locator, type Page } from "@playwright/test";

const lifecycleActions = [
  "Acknowledge order",
  "Start processing",
  "Mark as completed",
  "Cancel order",
] as const;

export async function openOrderDetails(page: Page, orderId: string) {
  await page.goto(`/orders/${orderId}`);
  const details = page.getByRole("dialog");

  await expect(details.getByRole("heading", { name: orderId })).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/orders/${orderId}$`));

  return details;
}

export async function expectNoLifecycleActions(details: Locator) {
  for (const name of lifecycleActions) {
    await expect(details.getByRole("button", { name })).toHaveCount(0);
  }
}
