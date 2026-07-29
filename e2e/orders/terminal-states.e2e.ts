import { expect, test } from "../fixtures";
import { expectNoLifecycleActions, openOrderDetails } from "./order-details";

test("does not show actions for an already completed order", async ({
  page,
}) => {
  const details = await openOrderDetails(page, "ORD-1003");

  await expect(
    details.getByText("Completed", { exact: true }).first(),
  ).toBeVisible();
  await expectNoLifecycleActions(details);
});

test("does not show actions for an already cancelled order", async ({
  page,
}) => {
  const details = await openOrderDetails(page, "ORD-1005");

  await expect(
    details.getByText("This order was cancelled.", { exact: true }),
  ).toBeVisible();
  await expectNoLifecycleActions(details);
});
