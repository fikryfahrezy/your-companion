import { expect, test } from "../fixtures";

test("changes page size and enforces pagination boundaries", async ({
  page,
}) => {
  await page.goto("/orders");

  const previousPage = page.getByRole("button", { name: "Previous page" });
  const nextPage = page.getByRole("button", { name: "Next page" });

  await expect(previousPage).toBeDisabled();

  await page.getByRole("combobox", { name: "Rows per page" }).click();
  await page.getByRole("option", { name: "12", exact: true }).click();

  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Showing 1–12 of 14")).toBeVisible();
  await expect(page).toHaveURL(/pageSize=12/);

  await nextPage.click();

  await expect(page).toHaveURL(/page=2/);
  await expect(page.getByText("Page 2 of 2", { exact: true })).toBeVisible();
  await expect(page.getByText("Showing 13–14 of 14")).toBeVisible();
  await expect(nextPage).toBeDisabled();
  await expect(previousPage).toBeEnabled();

  await previousPage.click();

  await expect(page.getByText("Page 1 of 2", { exact: true })).toBeVisible();
  await expect(previousPage).toBeDisabled();
});
