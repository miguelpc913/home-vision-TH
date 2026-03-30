import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type HousesQueryErrorAlertProps = {
  title: string;
  message: string;
  onRefetch: () => void;
};

export function HousesQueryErrorAlert({ title, message, onRefetch }: HousesQueryErrorAlertProps) {
  return (
    <Alert variant="destructive" className="max-w-xl mx-auto">
      <AlertCircle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-pretty">{message}</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0 border-destructive/40"
          onClick={onRefetch}
        >
          <RefreshCw className="size-4" />
          Refetch
        </Button>
      </AlertDescription>
    </Alert>
  );
}
