import { ArrowUp } from "lucide-react";
import { Button } from "@ui/button";
import { scrollToTopWithMotionPreference } from "./scrollToTopWithMotionPreference";
import { useHousesFeedScrollToTop } from "./useHousesFeedScrollToTop";
import { cn } from "@/lib/utils";

type Props = {
  onReturnToFirstPage: () => void;
};

export function HousesFeedScrollToTop({ onReturnToFirstPage }: Props) {
  const { scrolled } = useHousesFeedScrollToTop();

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      className={cn(
        "fixed bottom-6 z-50 size-11 rounded-full shadow-md transition-opacity motion-reduce:transition-none",
        "end-6 max-md:end-4 max-md:bottom-4",
        scrolled ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-hidden={!scrolled}
      tabIndex={scrolled ? 0 : -1}
      aria-label="Return to top and first page"
      onClick={() => {
        onReturnToFirstPage();
        scrollToTopWithMotionPreference();
      }}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
