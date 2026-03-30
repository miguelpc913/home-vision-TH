import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type FeedErrorFallbackProps = {
  error: Error;
  onRetry: () => void;
};

export function FeedErrorFallback({ error, onRetry }: FeedErrorFallbackProps) {
  return (
    <Alert variant="destructive" className="max-w-xl">
      <AlertCircle />
      <AlertTitle>Something broke while rendering</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-pretty">{error.message}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/40"
          onClick={onRetry}
        >
          <RefreshCw className="size-4" />
          Try again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
