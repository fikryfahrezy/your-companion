import { describe, expect, mock, test } from "bun:test";
import { fireEvent, screen, setup } from "@test/react";
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

function renderOrdersFilters(filters: OrdersFilterValues = defaultFilters) {
  const onChange = mock(() => {});
  const onClear = mock(() => {});
  const renderComponent = (nextFilters: OrdersFilterValues) => (
    <OrdersFilters
      filters={nextFilters}
      onChange={onChange}
      onClear={onClear}
    />
  );
  const view = setup(renderComponent(filters));

  return {
    ...view,
    onChange,
    onClear,
    rerenderWithFilters: (nextFilters: OrdersFilterValues) => {
      view.rerender(renderComponent(nextFilters));
    },
  };
}

describe("OrdersFilters component", () => {
  test("reports search input using the URL control contract", () => {
    const { onChange } = renderOrdersFilters();

    fireEvent.change(screen.getByRole("searchbox", { name: "Search orders" }), {
      target: { value: "Room 204" },
    });

    expect(onChange).toHaveBeenCalledWith("q", "Room 204", "");
  });

  test("changes the selected status", async () => {
    const { onChange, user } = renderOrdersFilters();

    await user.click(
      screen.getByRole("combobox", { name: "Filter by status" }),
    );
    await user.click(screen.getByRole("option", { name: "New" }));

    expect(onChange).toHaveBeenCalledWith("status", "New");
  });

  test("enables clearing only when filters are active", async () => {
    const { onClear, rerenderWithFilters, user } = renderOrdersFilters();

    const clearButton = screen.getByRole<HTMLButtonElement>("button", {
      name: "Clear",
    });
    expect(clearButton.disabled).toBe(true);

    rerenderWithFilters({
      ...defaultFilters,
      hasActiveFilters: true,
      statusFilter: "New",
    });

    expect(clearButton.disabled).toBe(false);
    await user.click(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
