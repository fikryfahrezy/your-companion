import { describe, expect, mock, test } from "bun:test";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  OrdersFilters,
  type OrdersFilterValues,
} from "~/features/orders/components/orders-filters";

const defaultFilters: OrdersFilterValues = {
  hasActiveFilters: false,
  rawSearch: "",
  serviceFilter: "all",
  sortDirection: "newest",
  statusFilter: "all",
};

describe("OrdersFilters component", () => {
  test("reports search input using the URL control contract", () => {
    const onChange = mock(() => {});

    render(
      <OrdersFilters
        filters={defaultFilters}
        onChange={onChange}
        onClear={() => {}}
      />,
    );

    fireEvent.change(screen.getByRole("searchbox", { name: "Search orders" }), {
      target: { value: "Room 204" },
    });

    expect(onChange).toHaveBeenCalledWith("q", "Room 204", "");
  });

  test("changes the selected status", async () => {
    const onChange = mock(() => {});
    const user = userEvent.setup();

    render(
      <OrdersFilters
        filters={defaultFilters}
        onChange={onChange}
        onClear={() => {}}
      />,
    );

    await user.click(
      screen.getByRole("combobox", { name: "Filter by status" }),
    );
    await user.click(screen.getByRole("option", { name: "New" }));

    expect(onChange).toHaveBeenCalledWith("status", "New");
  });

  test("enables clearing only when filters are active", async () => {
    const onClear = mock(() => {});
    const user = userEvent.setup();
    const { rerender } = render(
      <OrdersFilters
        filters={defaultFilters}
        onChange={() => {}}
        onClear={onClear}
      />,
    );

    const clearButton = screen.getByRole<HTMLButtonElement>("button", {
      name: "Clear",
    });
    expect(clearButton.disabled).toBe(true);

    rerender(
      <OrdersFilters
        filters={{
          ...defaultFilters,
          hasActiveFilters: true,
          statusFilter: "New",
        }}
        onChange={() => {}}
        onClear={onClear}
      />,
    );

    expect(clearButton.disabled).toBe(false);
    await user.click(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
