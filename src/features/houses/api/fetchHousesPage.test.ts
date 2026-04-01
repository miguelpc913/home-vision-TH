import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { isHousesListRequest, mockHouse } from "@/test/mocks/handlers";
import { server } from "@/test/mocks/server";

import { fetchHousesPage } from "./fetchHousesPage";

describe("fetchHousesPage", () => {
  it("returns houses when API succeeds", async () => {
    const list = await fetchHousesPage(1, 21);
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list[0]).toMatchObject({ id: mockHouse.id });
  });

  it("throws when JSON ok false", async () => {
    server.use(
      http.get(isHousesListRequest, () => HttpResponse.json({ ok: false, message: "Nope" })),
    );
    await expect(fetchHousesPage(1, 10)).rejects.toThrow("Nope");
  });

  it("throws on non-OK HTTP", async () => {
    server.use(http.get(isHousesListRequest, () => new HttpResponse(null, { status: 502 })));
    await expect(fetchHousesPage(1, 10)).rejects.toThrow();
  });

  it("throws a readable error on fetch/network failure", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("offline"));
    await expect(fetchHousesPage(1, 10)).rejects.toThrow("Could not fetch houses: offline");
    fetchSpy.mockRestore();
  });
});
