import { describe, expect, test } from "bun:test";
import { screen, setup } from "@test/react";
import { ToastProvider, useToast } from "~/components/feedback/toast-provider";

function ToastTrigger({ variant }: { variant: "success" | "error" }) {
  const { notify } = useToast();

  return (
    <button
      onClick={() =>
        notify({
          title: variant === "error" ? "Update failed" : "Order updated",
          description: "ORD-2001 has changed.",
          variant,
        })
      }
      type="button"
    >
      Notify
    </button>
  );
}

describe("ToastProvider component", () => {
  test("announces notifications with their description", async () => {
    const { user } = setup(
      <ToastProvider>
        <ToastTrigger variant="success" />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Notify" }));

    const notifications = screen.getByLabelText("Notifications");
    expect(notifications.getAttribute("aria-live")).toBe("polite");
    expect(screen.getByText("Order updated")).toBeDefined();
    expect(screen.getByText("ORD-2001 has changed.")).toBeDefined();
  });

  test("lets the user dismiss a notification", async () => {
    const { user } = setup(
      <ToastProvider>
        <ToastTrigger variant="error" />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Notify" }));
    expect(screen.getByText("Update failed")).toBeDefined();

    await user.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );

    expect(screen.queryByText("Update failed")).toBeNull();
  });
});
