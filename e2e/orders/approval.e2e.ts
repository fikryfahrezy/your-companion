import { expect, test } from "@playwright/test";
import { openOrderDetails } from "./order-details";

test("approves an Extra Bed request before normal processing", async ({
  page,
}) => {
  const details = await openOrderDetails(page, "ORD-1004");

  await expect(details.getByText("Manager approval required")).toBeVisible();
  await expect(details.getByText(/Current occupancy: 2/)).toBeVisible();
  await expect(
    details.getByRole("button", { name: "Approve request" }),
  ).toBeVisible();
  await expect(
    details.getByRole("button", { name: "Reject request" }),
  ).toBeVisible();

  await details.getByRole("button", { name: "Approve request" }).click();

  await expect(
    page.getByLabel("Notifications").getByText("Request approved"),
  ).toBeVisible();
  await expect(
    details.getByRole("button", { name: "Acknowledge order" }),
  ).toBeVisible();
});

test("requires confirmation before rejecting an approval request", async ({
  page,
}) => {
  const details = await openOrderDetails(page, "ORD-1004");

  await details.getByRole("button", { name: "Reject request" }).click();
  const confirmation = page.getByRole("alertdialog", {
    name: "Reject this request?",
  });
  await expect(confirmation).toBeVisible();
  await confirmation.getByRole("button", { name: "Reject request" }).click();

  await expect(
    page.getByLabel("Notifications").getByText("Request rejected"),
  ).toBeVisible();
  await expect(
    details.getByText("This order was cancelled.", { exact: true }),
  ).toBeVisible();
});
