import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center text-center">
      <p className="font-heading text-7xl font-bold text-primary/20">404</p>
      <h1 className="mt-4 font-heading text-2xl font-semibold">
        This page checked out
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you requested does not exist or may have moved.
      </p>
      <Button
        className="mt-6"
        nativeButton={false}
        render={<Link to="/" />}
        variant="outline"
      >
        <HugeiconsIcon data-icon="inline-start" icon={ArrowLeft01Icon} />
        Back to overview
      </Button>
    </div>
  );
}
