import { useState } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import type { House, FilterMode } from "@/features/houses/api/types";
import { useFavorites } from "@/features/houses/context/favoritesContext";
import { HouseDetail } from "@/features/houses/ui/HouseDetail";
import { HousesToolbar } from "@/features/houses/ui/HousesToolbar";
import { HousesFeed } from "@/features/houses/ui/HousesFeed";
import { ErrorActionAlert } from "@/features/houses/ui/ErrorActionAlert";

export function HousesPage() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [detailHouse, setDetailHouse] = useState<House | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

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
            <HousesFeed search={search} filterMode={filterMode} onOpenDetail={setDetailHouse} />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <HouseDetail
        key={detailHouse?.id ?? "closed"}
        house={detailHouse}
        open={detailHouse !== null}
        onOpenChange={o => {
          if (!o) setDetailHouse(null);
        }}
        isFavorite={detailHouse ? isFavorite(detailHouse.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
