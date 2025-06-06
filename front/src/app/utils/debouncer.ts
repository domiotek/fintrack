import { DestroyRef } from '@angular/core';

export function callDebounced<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  destroyRef: DestroyRef,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let isDestroyed = false;

  if (destroyRef) {
    destroyRef.onDestroy(() => {
      isDestroyed = true;
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    });
  }

  return (...args: Parameters<T>) => {
    if (isDestroyed) return;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      if (!isDestroyed) {
        fn(...args);
      }
      timeoutId = null;
    }, delay);
  };
}
