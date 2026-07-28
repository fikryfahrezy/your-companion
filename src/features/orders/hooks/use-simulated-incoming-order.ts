import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appConfig } from "~/app/app-config";
import { useToast } from "~/components/feedback/toast-provider";
import { simulateIncomingOrder } from "~/features/orders/api/orders-api";
import { orderKeys } from "~/features/orders/api/orders-queries";
import { trackEvent } from "~/lib/analytics";

export function useSimulatedIncomingOrder() {
  const queryClient = useQueryClient();
  const { notify } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    let isReceiving = false;

    const receiveOrder = async () => {
      if (isReceiving) return;
      isReceiving = true;

      try {
        const order = await simulateIncomingOrder(controller.signal);
        queryClient.setQueryData(orderKeys.detail(order.id), order);
        await queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

        trackEvent({ name: "realtime_order_received", orderId: order.id });
        notify({
          title: "New order received",
          description: `${order.id} · ${order.guestName}, Room ${order.roomNumber}`,
          variant: "success",
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        trackEvent({
          name: "realtime_order_failed",
          error:
            error instanceof Error
              ? error.message
              : "The simulated order could not be received.",
        });
      } finally {
        isReceiving = false;
      }
    };

    const interval = window.setInterval(
      () => void receiveOrder(),
      appConfig.realtimeSimulation.delayMs,
    );

    return () => {
      window.clearInterval(interval);
      controller.abort();
    };
  }, [notify, queryClient]);
}
