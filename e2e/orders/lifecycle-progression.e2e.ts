import { expect, test } from "@playwright/test";
import { expectNoLifecycleActions, openOrderDetails } from "./order-details";

test("moves a new order through every lifecycle transition", async ({
  page,
}) => {
  const details = await openOrderDetails(page, "ORD-1001");

  await expect(
    details.getByRole("button", { name: "Acknowledge order" }),
  ).toBeVisible();
  await expect(
    details.getByRole("button", { name: "Cancel order" }),
  ).toBeVisible();

  await details.getByRole("button", { name: "Acknowledge order" }).click();
  await expect(details.getByText("Updating…", { exact: true })).toHaveCount(0);
  await expect(
    details.getByRole("button", { name: "Start processing" }),
  ).toBeVisible();

  await details.getByRole("button", { name: "Start processing" }).click();
  await expect(
    details.getByRole("button", { name: "Mark as completed" }),
  ).toBeVisible();

  await details.getByRole("button", { name: "Mark as completed" }).click();
  await expect(
    page
      .getByLabel("Notifications")
      .getByText("Order updated", { exact: true })
      .last(),
  ).toBeVisible();
  await expectNoLifecycleActions(details);
});
