import { Loader2 } from "lucide-react";
import { Button } from "@ui/button";

type Props = {
  fetchPreviousPage: () => Promise<unknown>;
  hasPreviousPage: boolean;
  isFetchingPreviousPage: boolean;
};

export function HousesFeedPreviousControls({
  fetchPreviousPage,
  hasPreviousPage,
  isFetchingPreviousPage,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center ">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="inline-flex gap-2 "
        disabled={!hasPreviousPage || isFetchingPreviousPage}
        onClick={fetchPreviousPage}
      >
        {isFetchingPreviousPage ? <Loader2 className="size-4 animate-spin" /> : null}
        Load previous page
      </Button>
    </div>
  );
}
