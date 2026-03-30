import { useState } from "react";
import { HousesFeed } from "@/features/houses/components/HousesFeed/HousesFeed";
import { HouseDetail } from "@/features/houses/components/HouseDetail";
import { HousesToolbar, type FilterMode } from "@/features/houses/components/HousesToolbar";
import type { House } from "@/features/houses/api/types";
import { FavoritesProvider, useFavorites } from "@/features/houses/context/favoritesContext";

function HousesPageContent() {
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

      <HousesFeed search={search} filterMode={filterMode} onOpenDetail={setDetailHouse} />

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

export function HousesPage() {
  return (
    <FavoritesProvider>
      <HousesPageContent />
    </FavoritesProvider>
  );
}
