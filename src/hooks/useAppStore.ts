// ─── useAppStore ──────────────────────────────────────────────────────────────
//
// Granular selector hooks consumed by components in the app.
// Each hook delegates to either the React Context store or the Zustand store
// depending on the active StoreMode, which is managed globally via a plain
// module-level atom (no extra context layer needed).
//
// Rules of Hooks note: both hooks are always called unconditionally; only the
// return value of the active store is used.
//
// In Zustand mode each hook subscribes to exactly one slice, so a component
// that only calls useAppUser() will NOT re-render when userCardInfo changes.
// In Context mode every call to useUser() subscribes to the full context
// object — the over-subscription problem being demonstrated.
//
// Usage:
//   const user             = useAppUser()
//   const setUser          = useAppSetUser()
//   const userCardInfo     = useAppUserCardInfo()
//   const setUserCardInfo  = useAppSetUserCardInfo()

import { useUser } from "@/contexts/UserContext";
import { useUserStore } from "@/stores/useUserStore";
import { useSyncExternalStore } from "react";

// ─── StoreMode atom (micro pub-sub, no library needed) ────────────────────────

export type StoreMode = "context" | "zustand";

let _mode: StoreMode = "context";
let _resetKey = 0;
const _listeners = new Set<() => void>();

export function getStoreMode(): StoreMode {
  return _mode;
}

export function getStoreResetKey(): number {
  return _resetKey;
}

export function setStoreMode(mode: StoreMode) {
  if (_mode === mode) return;
  _mode = mode;
  _resetKey++;
  _listeners.forEach((fn) => fn());
}

function subscribeStoreMode(cb: () => void) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

export function useStoreMode(): StoreMode {
  return useSyncExternalStore(subscribeStoreMode, getStoreMode);
}

export function useStoreResetKey(): number {
  return useSyncExternalStore(subscribeStoreMode, getStoreResetKey);
}

// ─── Granular selector hooks ──────────────────────────────────────────────────

export function useAppUser() {
  const mode = useStoreMode();
  const { user: ctxUser } = useUser();
  const zustandUser = useUserStore((s) => s.user);
  return mode === "zustand" ? zustandUser : ctxUser;
}

export function useAppSetUser() {
  const mode = useStoreMode();
  const { setUser: ctxSetUser } = useUser();
  const zustandSetUser = useUserStore((s) => s.setUser);
  return mode === "zustand" ? zustandSetUser : ctxSetUser;
}

export function useAppUserCardInfo() {
  const mode = useStoreMode();
  const { userCardInfo: ctxCardInfo } = useUser();
  const zustandCardInfo = useUserStore((s) => s.userCardInfo);
  return mode === "zustand" ? zustandCardInfo : ctxCardInfo;
}

export function useAppSetUserCardInfo() {
  const mode = useStoreMode();
  const { setUserCardInfo: ctxSetCardInfo } = useUser();
  const zustandSetCardInfo = useUserStore((s) => s.setUserCardInfo);
  return mode === "zustand" ? zustandSetCardInfo : ctxSetCardInfo;
}

