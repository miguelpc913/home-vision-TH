import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { useHousesPage } from "./useHousesPage";
import { HouseDetail } from "@/features/houses/components/HouseDetail/HouseDetail";
import { HousesToolbar } from "@/features/houses/components/HousesToolbar/HousesToolbar";
import { HousesFeed } from "@/features/houses/components/HouseFeed/HousesFeed";
import { ErrorActionAlert } from "@/features/houses/components/ErrorActionAlert/ErrorActionAlert";

export function HousesPage() {
  const {
    search,
    setSearch,
    filterMode,
    setFilterMode,
    detailHouse,
    openDetail,
    onDetailOpenChange,
    detailOpen,
  } = useHousesPage();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          Browse homes
        </h1>
      </header>

      <HousesToolbar
        search={search}
        onSearchChange={setSearch}
        filterMode={filterMode}
        onFilterChange={setFilterMode}
      />

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            onReset={reset}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorActionAlert
                title="Something broke while rendering"
                message={(error instanceof Error ? error : new Error(String(error))).message}
                actionLabel="Try again"
                actionLoadingLabel="Retrying..."
                onAction={() => {
                  reset();
                  resetErrorBoundary();
                }}
              />
            )}
          >
            <HousesFeed search={search} filterMode={filterMode} onOpenDetail={openDetail} />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <HouseDetail
        key={detailHouse?.id ?? "closed"}
        house={detailHouse}
        open={detailOpen}
        onOpenChange={onDetailOpenChange}
      />
    </div>
  );
}
