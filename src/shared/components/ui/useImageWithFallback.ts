import { useState } from "react";

export function useImageWithFallback() {
  const [loadFailed, setLoadFailed] = useState(false);
  const onImgError = () => setLoadFailed(true);
  return { loadFailed, onImgError };
}
