import { useEffect, useMemo, useState } from "react";

export type HousesListingUrlState = {
  currentPage: number;
};

function readUrlState(): HousesListingUrlState {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page") ?? "", 10);
  return {
    currentPage: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

function writeUrlState(state: HousesListingUrlState) {
  const params = new URLSearchParams();
  const currentPage = Math.max(1, state.currentPage);
  params.set("page", String(currentPage));

  const qs = params.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", next);
}

/**
 * Native URL sync for houses feed depth.
 * Stores only the current loaded page as `page`.
 */
export function useHousesListingUrlState() {
  const [state, setState] = useState<HousesListingUrlState>(readUrlState);

  useEffect(() => {
    const onPopState = () => setState(readUrlState());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return useMemo(() => {
    function setCurrentPage(currentPage: number) {
      const page = Math.max(1, currentPage);
      if (page === state.currentPage) return;
      const next = { currentPage: page };
      writeUrlState(next);
      setState(next);
    }

    return { ...state, setCurrentPage };
  }, [state]);
}
