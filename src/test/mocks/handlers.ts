import { http, HttpResponse } from "msw";

import type { House } from "@/features/houses/api/types";

export const mockHouse: House = {
  id: 1,
  address: "1 Test Street",
  homeowner: "Test Owner",
  price: 250000,
  photoURL: "https://example.com/photo.jpg",
};

/** Matches Vite dev proxy `/api/houses` and production/staging `.../api_project/houses`. */
export function isHousesListRequest({ request }: { request: Request }): boolean {
  const { pathname } = new URL(request.url);
  return pathname === "/api/houses" || pathname.endsWith("/api_project/houses");
}

export function housesSuccessHandler(houses: House[] = [mockHouse]) {
  return http.get(isHousesListRequest, ({ request }) => {
    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
    const perPage = Number.parseInt(url.searchParams.get("per_page") ?? "10", 10);
    return HttpResponse.json({
      ok: true as const,
      houses: houses.slice((page - 1) * perPage, page * perPage),
    });
  });
}

export const housesHandlers = [housesSuccessHandler()];

export function housesErrorBodyHandler(message = "Service Unavailable") {
  return http.get(isHousesListRequest, () =>
    HttpResponse.json({ ok: false as const, message }, { status: 200 }),
  );
}

export function housesHttpErrorHandler(status = 503) {
  return http.get(isHousesListRequest, () => new HttpResponse(null, { status }));
}
