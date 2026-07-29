import { expect, test } from "../fixtures";
import { expectNoLifecycleActions, openOrderDetails } from "./order-details";

test("keeps the order when cancellation is dismissed", async ({ page }) => {
  const details = await openOrderDetails(page, "ORD-1006");

  await details.getByRole("button", { name: "Cancel order" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Cancel this order?",
  });

  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "Keep order" }).click();

  await expect(confirmation).toBeHidden();
  await expect(
    details.getByRole("button", { name: "Acknowledge order" }),
  ).toBeVisible();
});

test("cancels an active order and removes lifecycle actions", async ({
  page,
}) => {
  const details = await openOrderDetails(page, "ORD-1006");

  await details.getByRole("button", { name: "Cancel order" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Cancel this order?",
  });
  await confirmation.getByRole("button", { name: "Cancel order" }).click();
  await expect(
    confirmation.getByText("Cancelling…", { exact: true }),
  ).toHaveCount(0);

  await expect(
    page.getByText("Order cancelled", { exact: true }),
  ).toBeVisible();
  await expect(
    details.getByText("This order was cancelled.", { exact: true }),
  ).toBeVisible();
  await expectNoLifecycleActions(details);
});
