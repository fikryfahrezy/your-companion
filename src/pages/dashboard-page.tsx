import {
  PageLoadingState,
  QueryErrorState,
} from "~/components/feedback/query-state";
import {
  OrderFlowCard,
  ServiceDemandCard,
} from "~/features/dashboard/components/dashboard-breakdown";
import { DashboardHeader } from "~/features/dashboard/components/dashboard-header";
import { DashboardMetrics } from "~/features/dashboard/components/dashboard-metrics";
import {
  AttentionOrdersCard,
  RecentOrdersCard,
} from "~/features/dashboard/components/dashboard-orders";
import { useDashboard } from "~/features/dashboard/hooks/use-dashboard";
import { useSimulatedIncomingOrder } from "~/features/orders/hooks/use-simulated-incoming-order";

export function DashboardPage() {
  useSimulatedIncomingOrder();
  const dashboard = useDashboard();

  if (dashboard.isPending) return <PageLoadingState />;

  if (dashboard.isError) {
    return (
      <QueryErrorState
        message={dashboard.errorMessage ?? "The dashboard could not be loaded."}
        onRestore={dashboard.restoreData}
        onRetry={dashboard.retry}
      />
    );
  }

  if (!dashboard.data) return null;

  return (
    <div className="space-y-6">
      <DashboardHeader today={dashboard.today} />
      <DashboardMetrics metrics={dashboard.data.metrics} />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <OrderFlowCard
          statusCounts={dashboard.data.statusCounts}
          totalOrders={dashboard.totalOrders}
        />
        <ServiceDemandCard serviceCounts={dashboard.data.serviceCounts} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <AttentionOrdersCard orders={dashboard.data.attentionOrders} />
        <RecentOrdersCard orders={dashboard.data.recentOrders} />
      </div>
    </div>
  );
}
