import { describe, expect, mock, test } from "bun:test";
import { screen, setup } from "@test/react";
import { PaginationControls } from "~/components/navigation/pagination-controls";

describe("PaginationControls component", () => {
  test("moves between available pages", async () => {
    const onPageChange = mock(() => {});
    const { user } = setup(
      <PaginationControls
        onPageChange={onPageChange}
        onPageSizeChange={() => {}}
        pageSizeOptions={[8, 12, 20]}
        pagination={{ page: 2, pageSize: 8, total: 24, totalPages: 3 }}
      />,
    );

    expect(screen.getByText("Page 2 of 3")).toBeDefined();
    await user.click(screen.getByRole("button", { name: "Previous page" }));
    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  test("disables navigation at a single-page boundary", () => {
    setup(
      <PaginationControls
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        pageSizeOptions={[8, 12, 20]}
        pagination={{ page: 1, pageSize: 8, total: 5, totalPages: 1 }}
      />,
    );

    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Previous page" })
        .disabled,
    ).toBe(true);
    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Next page" })
        .disabled,
    ).toBe(true);
  });

  test("does not render controls for an empty result", () => {
    const { container } = setup(
      <PaginationControls
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        pageSizeOptions={[8, 12, 20]}
        pagination={{ page: 1, pageSize: 8, total: 0, totalPages: 1 }}
      />,
    );

    expect(container.childElementCount).toBe(0);
  });
});
