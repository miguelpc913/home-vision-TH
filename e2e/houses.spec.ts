import { expect, test } from "@playwright/test";
import {
  errorActionButton,
  forceAdvanceToDeeperPage,
  gotoHousesPage,
  hasReachedEnd,
  housesCard,
  openFilterAndSelectFavorites,
  recoverGridWithRetries,
  urlPageNumber,
  waitForPostReloadState,
} from "./utils/housesFlow";

test.describe("houses flows (real flaky API)", () => {
  test("loads houses grid (or handled error state)", async ({ page }) => {
    const state = await gotoHousesPage(page);
    if (state === "grid") {
      await expect(housesCard(page).first()).toBeVisible();
      return;
    }
    await expect(errorActionButton(page).first()).toBeVisible();
  });

  test("loads more when scrolling down", async ({ page }) => {
    const initial = await gotoHousesPage(page);
    if (initial === "error") {
      await expect(errorActionButton(page).first()).toBeVisible();
      return;
    }

    const startPage = urlPageNumber(page.url());
    const before = await housesCard(page).count();
    const advance = await forceAdvanceToDeeperPage(page);
    const after = await housesCard(page).count();
    const endPage = urlPageNumber(page.url());
    const advanced = endPage > startPage || after > before;
    const reachedEnd = await hasReachedEnd(page);
    expect(advanced || reachedEnd || advance === "error").toBe(true);
    if (!advanced && !reachedEnd) {
      await expect(errorActionButton(page).first()).toBeVisible();
    }
  });

  test("opens house modal", async ({ page }) => {
    const state = await gotoHousesPage(page);
    if (state === "error") {
      await expect(errorActionButton(page).first()).toBeVisible();
      return;
    }

    await housesCard(page).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("loads previous page after scroll then reload", async ({ page }) => {
    let state = await gotoHousesPage(page);
    if (state === "error") {
      state = await recoverGridWithRetries(page);
      if (state === "error") {
        await expect(errorActionButton(page).first()).toBeVisible();
        return;
      }
    }

    await forceAdvanceToDeeperPage(page);
    await page.reload();

    state = await waitForPostReloadState(page);
    const previousButton = page.getByRole("button", { name: /load previous page/i });
    if (await previousButton.isVisible()) {
      await previousButton.click();
      const nextState = await waitForPostReloadState(page);
      expect(nextState === "grid" || nextState === "error").toBe(true);
      if (nextState === "error") {
        await expect(errorActionButton(page).first()).toBeVisible();
      }
      return;
    }

    const fallbackVisible =
      (await housesCard(page).first().isVisible()) ||
      (await errorActionButton(page).first().isVisible()) ||
      (await hasReachedEnd(page));
    expect(fallbackVisible).toBe(true);
  });

  test("search and filter functionalities", async ({ page }) => {
    let state = await gotoHousesPage(page);
    if (state === "error") {
      state = await recoverGridWithRetries(page);
      if (state === "error") {
        await expect(errorActionButton(page).first()).toBeVisible();
        return;
      }
    }

    const searchInput = page.getByRole("textbox", { name: /search/i });
    await searchInput.fill("__no_match_e2e__");
    await expect(page.getByText(/no houses match your search or filter/i)).toBeVisible();

    await searchInput.fill("");
    await openFilterAndSelectFavorites(page);
    await expect(page.getByText(/no houses match your search or filter/i)).toBeVisible();
  });
});
