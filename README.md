# react-context-behaviors

An interactive React demo that visualizes **re-render cascades** and the **over-subscription problem** with React Context, and lets you compare it side-by-side with Zustand selector-based subscriptions — live, in the browser.

Click the **Guide** button (?) in the top-right of the app for an in-app walkthrough.

---

## What it demonstrates

### The over-subscription problem (Context mode)

When two independent values (`user` and `userCardInfo`) share a **single context object**, every consumer re-renders whenever **either** value changes — even if it only reads the other one.

- Click **"Change data"** on the User Info card → it re-renders as expected, but `UserCardInfoDisplay` (reads `userCardInfo`) also re-renders (⚠ wasted render).
- Click **"Change data"** on the Card Info card → the opposite happens.

Both display cards track this with `✓ from X: ×N` (expected) and `⚠ unrelated: ×N` (wasted) render counters.

### Children cascade

Each display card contains **20 cascade children**:

| Type | Description |
|---|---|
| `PlainChild` (#1–10) | No `React.memo`. Re-renders **every time its parent re-renders** — cascades unconditionally. |
| `MemoChild` (#11–20) | Wrapped in `React.memo`. **Bails out** when props haven't changed, even when parent re-renders. |

Each child renders **100 sub-children** (3×3px colored dots that toggle green↔blue each render) to amplify the visual cascade.

### Direct subscriber children (Subscribers Card)

A full-width card below the two display cards hosts:

| Type | Description |
|---|---|
| `ContextChild` (#1–10) | Calls `useAppUser()`. In Zustand re-renders **only when `user` changes**. In Context re-renders on any change. |
| `CardInfoChild` (#11–20) | Calls `useAppUserCardInfo()`. In Zustand re-renders **only when `userCardInfo` changes**. In Context re-renders on any change. |

The Subscribers Card itself has **no store subscription** — it stays at ×1 renders. Only the individual subscriber children re-render, independently of their parent.

### Zustand mode — selective subscriptions

Switch to **Zustand** in the header dropdown. Each granular hook subscribes to exactly one slice:

```ts
const user        = useAppUser()           // s => s.user
const cardInfo    = useAppUserCardInfo()   // s => s.userCardInfo
```

Clicking "Change data" on one card only re-renders subscribers of that slice — no wasted renders, no ⚠ counters.

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Tech stack

| Tool | Role |
|---|---|
| React 19 + Vite 6 | Framework + build |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Shadcn (new-york / zinc) | UI components |
| Zustand | Alternative store |

> **Note:** React `StrictMode` is intentionally disabled so render counts are accurate (StrictMode double-invokes renders in development to detect side-effects).

---

## Key files

```
src/
├── contexts/UserContext.tsx          — React Context (user + userCardInfo in one object)
├── stores/useUserStore.ts            — Zustand store (same shape, selector-based)
├── hooks/
│   ├── useAppStore.ts                — Granular hooks: useAppUser / useAppUserCardInfo / ...
│   └── useRenderCount.ts             — Ref-based render counter (no extra re-renders)
└── components/
    ├── UserCard.tsx                   — Consumes `user`, "Change data" button, 20 cascade children
    ├── UserCardInfoDisplay.tsx        — Consumes `userCardInfo`, "Change data" button, 20 cascade children
    ├── SubscribersCard.tsx            — Full-width card with 20 direct subscriber children
    ├── GuideDialog.tsx                — In-app guide modal (auto-opens on first visit)
    ├── ChildrenGrid.tsx               — Exports CascadeGrid + SubscribersGrid
    └── ChildComponent.tsx             — ContextChild / CardInfoChild / PlainChild / MemoChild
```

### How the dual-store switch works

Granular hooks in `useAppStore.ts` always call both `useUser()` (Context) and the matching Zustand selector — Rules of Hooks requires unconditional calls. Only the active store's value is returned. A module-level `_mode` variable + `useSyncExternalStore` listener set drives reactivity without an extra Provider. Switching modes increments `_resetKey`, which remounts the content area via a React `key` prop, resetting all `useRef`-based render counters to zero.
