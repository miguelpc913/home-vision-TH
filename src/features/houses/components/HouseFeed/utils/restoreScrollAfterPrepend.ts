export type DocumentScrollSnapshot = {
  scrollHeight: number;
  scrollY: number;
};

/** After prepending content above the fold, restore the same viewport anchor. */
export function restoreScrollAfterPrepend(before: DocumentScrollSnapshot): void {
  const delta = document.documentElement.scrollHeight - before.scrollHeight;
  window.scrollTo({ top: before.scrollY + delta, left: 0, behavior: "auto" });
}
