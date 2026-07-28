import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";
import { appConfig } from "~/app/app-config";
import { Button } from "~/components/ui/button";

export function DashboardHeader({ today }: { today: string }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-medium text-primary">{today}</p>
        <h1 className="mt-1 font-heading text-2xl font-semibold tracking-tight md:text-3xl">
          Good afternoon, {appConfig.operator.firstName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is what is happening across the hotel right now.
        </p>
      </div>
      <Button
        className="self-start sm:self-auto"
        nativeButton={false}
        render={<Link to="/orders" />}
      >
        View all orders
        <HugeiconsIcon data-icon="inline-end" icon={ArrowRight01Icon} />
      </Button>
    </div>
  );
}
