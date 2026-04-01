import { useState } from "react";

export function useErrorActionAlert(onAction: () => void | Promise<unknown>) {
  const [isActing, setIsActing] = useState(false);

  async function handleAction() {
    setIsActing(true);
    try {
      await onAction();
    } finally {
      setIsActing(false);
    }
  }

  return { isActing, handleAction };
}
