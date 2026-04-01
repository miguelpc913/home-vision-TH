import { useEffect, useState } from "react";

const SCROLL_SHOW_PX = 400;

export function useHousesFeedScrollToTop() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_SHOW_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return { scrolled };
}
