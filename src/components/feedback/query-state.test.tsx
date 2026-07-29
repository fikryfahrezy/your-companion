import { describe, expect, mock, test } from "bun:test";
import { screen, setup } from "@test/react";
import {
  EmptyOrdersState,
  PageLoadingState,
  QueryErrorState,
} from "~/components/feedback/query-state";

describe("query state components", () => {
  test("exposes an accessible loading state", () => {
    setup(<PageLoadingState />);

    const loadingState = screen.getByLabelText("Loading dashboard");

    expect(loadingState.getAttribute("aria-busy")).toBe("true");
  });

  test("lets the user retry and restore a failed query", async () => {
    const onRetry = mock(() => {});
    const onRestore = mock(() => {});
    const { user } = setup(
      <QueryErrorState
        message="The service is unavailable."
        onRestore={onRestore}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText("Unable to load orders")).toBeDefined();
    expect(screen.getByText("The service is unavailable.")).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    await user.click(screen.getByRole("button", { name: "Restore data" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onRestore).toHaveBeenCalledTimes(1);
  });

  test("lets the user clear controls from the empty state", async () => {
    const onClear = mock(() => {});
    const { user } = setup(<EmptyOrdersState onClear={onClear} />);

    expect(screen.getByText("No orders found")).toBeDefined();
    await user.click(
      screen.getByRole("button", { name: "Clear search and filters" }),
    );

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
