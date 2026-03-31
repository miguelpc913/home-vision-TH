import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  message: string;
  actionLabel: string;
  actionLoadingLabel?: string;
  onAction: () => void | Promise<unknown>;
  className?: string;
};

export function ErrorActionAlert({
  title,
  message,
  actionLabel,
  actionLoadingLabel,
  onAction,
  className,
}: Props) {
  const [isActing, setIsActing] = useState(false);

  async function handleAction() {
    setIsActing(true);
    try {
      await onAction();
    } finally {
      setIsActing(false);
    }
  }

  return (
    <Alert variant="destructive" className={cn("max-w-xl", className)}>
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-pretty">{message}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/40"
          onClick={handleAction}
          disabled={isActing}
        >
          {isActing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <RefreshCw className="size-4" />
          )}
          {isActing ? (actionLoadingLabel ?? actionLabel) : actionLabel}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
