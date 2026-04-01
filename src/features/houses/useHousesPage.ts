import { useState } from "react";
import type { FilterMode, House } from "@/features/houses/api/types";

export function useHousesPage() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [detailHouse, setDetailHouse] = useState<House | null>(null);

  function openDetail(house: House) {
    setDetailHouse(house);
  }

  function onDetailOpenChange(open: boolean) {
    if (!open) setDetailHouse(null);
  }

  return {
    search,
    setSearch,
    filterMode,
    setFilterMode,
    detailHouse,
    openDetail,
    onDetailOpenChange,
    detailOpen: detailHouse !== null,
  };
}
