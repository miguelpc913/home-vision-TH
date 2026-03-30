import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/shared/context/themeContext";
import { Button } from "@ui/button";

export function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="font-heading text-lg font-semibold tracking-tight">HomeVision</span>
          <span className="hidden text-muted-foreground sm:inline">·</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">Listings explorer</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          <span className="sr-only md:not-sr-only md:ml-1.5">
            {theme === "dark" ? "Light" : "Dark"}
          </span>
        </Button>
      </div>
    </header>
  );
}
