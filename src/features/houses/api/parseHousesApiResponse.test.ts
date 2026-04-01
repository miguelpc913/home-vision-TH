import { describe, expect, it } from "vitest";

import { parseHousesApiResponse } from "./parseHousesApiResponse";

describe("parseHousesApiResponse", () => {
  it("parses ok success with valid houses", () => {
    const row = {
      id: 0,
      address: "a",
      homeowner: "b",
      price: 1,
      photoURL: "https://x",
    };
    expect(parseHousesApiResponse({ ok: true, houses: [row] })).toEqual({
      ok: true,
      houses: [row],
    });
  });

  it("skips invalid house rows", () => {
    expect(
      parseHousesApiResponse({
        ok: true,
        houses: [{ id: "bad" }, { id: 1, address: "a", homeowner: "b", price: 1, photoURL: "u" }],
      }),
    ).toEqual({
      ok: true,
      houses: [{ id: 1, address: "a", homeowner: "b", price: 1, photoURL: "u" }],
    });
  });

  it("returns error response when ok false", () => {
    expect(parseHousesApiResponse({ ok: false, message: "Down" })).toEqual({
      ok: false,
      message: "Down",
    });
  });

  it("uses default message when ok false and message missing", () => {
    expect(parseHousesApiResponse({ ok: false })).toEqual({
      ok: false,
      message: "Request failed",
    });
  });

  it("throws when not an object", () => {
    expect(() => parseHousesApiResponse(null)).toThrow("Unexpected response shape");
  });

  it("throws when ok missing", () => {
    expect(() => parseHousesApiResponse({ houses: [] })).toThrow("Unexpected response shape");
  });

  it("throws when houses not array on success", () => {
    expect(() => parseHousesApiResponse({ ok: true, houses: 1 })).toThrow("Unexpected response shape");
  });
});
