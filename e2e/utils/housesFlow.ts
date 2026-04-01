import { expect, type Locator, type Page } from "@playwright/test";

export type HousesUiState = "grid" | "error";

export const housesCard = (page: Page): Locator =>
  page.locator('[aria-label^="View details for "]');

export const errorActionButton = (page: Page): Locator =>
  page.getByRole("button", { name: /refetch|try again/i });

export const footerStatusText = (page: Page): Locator =>
  page.getByText(/scroll for more|loading more|reached the end/i).first();

export async function waitForGridOrHandledError(page: Page): Promise<HousesUiState> {
  const card = housesCard(page).first();
  const errorButton = errorActionButton(page).first();

  const state = await Promise.race([
    card
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(() => "grid" as const)
      .catch(() => null),
    errorButton
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(() => "error" as const)
      .catch(() => null),
  ]);

  if (!state) {
    throw new Error("Neither houses grid nor handled error UI appeared.");
  }
  return state;
}

export async function recoverGridWithRetries(page: Page, retries = 3): Promise<HousesUiState> {
  let state = await waitForGridOrHandledError(page);
  for (let i = 0; i < retries && state === "error"; i += 1) {
    const action = errorActionButton(page).first();
    const canRetry = await action
      .waitFor({ state: "visible", timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    if (!canRetry) return "error";
    await action.click();
    state = await waitForGridOrHandledError(page);
  }
  return state;
}

export async function scrollToLoadMore(page: Page): Promise<HousesUiState> {
  await page.mouse.wheel(0, 5000);
  const footer = footerStatusText(page);
  const hasFooter = await footer
    .waitFor({ state: "visible", timeout: 2_000 })
    .then(() => true)
    .catch(() => false);
  if (hasFooter) {
    await footer.scrollIntoViewIfNeeded();
  }
  await page.mouse.wheel(0, 5000);
  return waitForGridOrHandledError(page);
}

export async function gotoHousesPage(page: Page): Promise<HousesUiState> {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /browse homes/i })).toBeVisible();
  return waitForGridOrHandledError(page);
}

export async function waitForPostReloadState(page: Page): Promise<HousesUiState> {
  const state = await Promise.race([
    housesCard(page)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(() => "grid" as const)
      .catch(() => null),
    errorActionButton(page)
      .first()
      .waitFor({ state: "visible", timeout: 15_000 })
      .then(() => "error" as const)
      .catch(() => null),
  ]);
  return state ?? "error";
}

export async function openFilterAndSelectFavorites(page: Page) {
  await page.locator("#house-filter").click();
  await page.getByRole("option", { name: "Favorites only" }).click();
}

export function urlPageNumber(url: string): number {
  const raw = new URL(url).searchParams.get("page");
  const parsed = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
}

export async function forceAdvanceToDeeperPage(
  page: Page,
): Promise<"advanced" | "stopped" | "error"> {
  for (let i = 0; i < 4; i += 1) {
    const beforePage = urlPageNumber(page.url());
    const state = await scrollToLoadMore(page);
    if (state === "error") return "error";
    await page.waitForTimeout(800);
    const afterPage = urlPageNumber(page.url());
    if (afterPage > beforePage) return "advanced";
    const footerCopy = await safeFooterCopy(page);
    if (/reached the end/i.test(footerCopy)) return "stopped";
  }
  return "stopped";
}

export async function hasReachedEnd(page: Page): Promise<boolean> {
  const copy = await safeFooterCopy(page);
  return /reached the end/i.test(copy);
}

async function safeFooterCopy(page: Page): Promise<string> {
  const footer = footerStatusText(page);
  const hasFooter = await footer
    .waitFor({ state: "visible", timeout: 1_500 })
    .then(() => true)
    .catch(() => false);
  if (!hasFooter) return "";
  return (await footer.textContent()) ?? "";
}
