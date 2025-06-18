import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("resize", onChange);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false; // Default value for SSR
  }
  return window.innerWidth < MOBILE_BREAKPOINT;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
