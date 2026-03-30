import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { FeedErrorFallback } from "./FeedErrorFallback";
import { HousesFeedInner } from "./HousesFeedInner";
import type { House } from "@/features/houses/api/types";
import type { FilterMode } from "@/features/houses/components/HousesToolbar";

export type HousesFeedProps = {
  search: string;
  filterMode: FilterMode;
  onOpenDetail: (house: House) => void;
};

export function HousesFeed(props: HousesFeedProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <FeedErrorFallback
              error={error instanceof Error ? error : new Error(String(error))}
              onRetry={() => {
                reset();
                resetErrorBoundary();
              }}
            />
          )}
        >
          <HousesFeedInner {...props} />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
