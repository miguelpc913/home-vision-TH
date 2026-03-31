import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

const SCROLL_SHOW_PX = 400;

type Props = {
  onReturnToFirstPage: () => void;
};

export function HousesFeedScrollToTop({ onReturnToFirstPage }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_SHOW_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }}
    >
      <ArrowUp className="size-5" />
    </Button>
  );
}
