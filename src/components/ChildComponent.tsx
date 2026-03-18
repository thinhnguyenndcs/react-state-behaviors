import { memo, useRef } from "react";
import { useAppUser, useAppUserCardInfo } from "@/hooks/useAppStore";

// Module-level stable ID array — never recreated on any render.
const SUB_IDS = Array.from({ length: 100 }, (_, i) => i + 1);

// ─── Flash overlay (parent children) ───────────────────────────────────────────
// key change → React unmounts old div + mounts new one → CSS animation restarts.

function RenderFlash({ count }: { count: number }) {
  return (
    <div
      key={count}
      className="pointer-events-none absolute inset-0 rounded animate-[render-highlight_1s_ease-out_forwards]"
    />
  );
}

// ─── Sub-child dot ──────────────────────────────────────────────────────────────
// Extremely lean 3×3 px dot. No React.memo.
// Alternates color each render so the cascade is visible:
//   odd  renders → green   (initial mount, or every other re-render)
//   even renders → blue

function PlainSubChild() {
  const ref = useRef(0);
  ref.current++;
  const isOdd = ref.current % 2 === 1;
  return (
    <span
      className={[
        "block rounded-sm transition-colors duration-200 w-[3px] h-[3px]",
        isOdd ? "bg-green-300/80" : "bg-blue-300/80",
      ].join(" ")}
    />
  );
}

// ─── ContextChild ────────────────────────────────────────────────────────────
// Directly calls useUser() → subscribes to the full context.
// Re-renders on EVERY context change (user OR userCardInfo), independently of
// whether its parent re-rendered. Even React.memo cannot stop this — the
// component itself is a context subscriber.

export const ContextChild = memo(function ContextChild({ id }: { id: number }) {
  const user = useAppUser();
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  const renderCount = renderCountRef.current;

  const initials =
    ((user.firstname[0] ?? "") + (user.lastname[0] ?? "")).toUpperCase() ||
    null;

  return (
    <div className="relative rounded border bg-blue-50 overflow-hidden flex flex-col select-none p-1 gap-0.5">
      <RenderFlash count={renderCount} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500">#{id}</span>
        <span className="text-[8px] font-medium text-blue-500">ctx</span>
        <span className="text-[8px] text-gray-400 tabular-nums">
          ×{renderCount}
        </span>
      </div>

      {/* Shows user initials — proof it received context value */}
      <div className="relative z-10 flex items-center gap-px justify-center">
        {initials ? (
          <span className="text-[8px] font-bold text-blue-600">{initials}</span>
        ) : (
          <span className="text-[8px] text-gray-300">···</span>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap gap-px content-start">
        {SUB_IDS.map((sid) => (
          <PlainSubChild key={sid} />
        ))}
      </div>
    </div>
  );
});

// ─── CardInfoChild ──────────────────────────────────────────────────────────
// Directly subscribes to userCardInfo only (useAppUserCardInfo).
// In Zustand mode it ONLY re-renders when userCardInfo changes.
// In Context mode it re-renders on any context change (over-subscription).

export const CardInfoChild = memo(function CardInfoChild({ id }: { id: number }) {
  const cardInfo = useAppUserCardInfo();
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  const renderCount = renderCountRef.current;

  const roleAbbr = cardInfo.role ? cardInfo.role.slice(0, 3).toUpperCase() : null;

  return (
    <div className="relative rounded border bg-emerald-50 overflow-hidden flex flex-col select-none p-1 gap-0.5">
      <RenderFlash count={renderCount} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500">#{id}</span>
        <span className="text-[8px] font-medium text-emerald-600">card</span>
        <span className="text-[8px] text-gray-400 tabular-nums">
          ×{renderCount}
        </span>
      </div>

      {/* Shows role abbreviation — proof it received cardInfo value */}
      <div className="relative z-10 flex items-center gap-px justify-center">
        {roleAbbr ? (
          <span className="text-[8px] font-bold text-emerald-600">{roleAbbr}</span>
        ) : (
          <span className="text-[8px] text-gray-300">···</span>
        )}
      </div>

      <div className="relative z-10 flex flex-wrap gap-px content-start">
        {SUB_IDS.map((sid) => (
          <PlainSubChild key={sid} />
        ))}
      </div>
    </div>
  );
});

// ─── PlainChild ──────────────────────────────────────────────────────────────
// No React.memo. Re-renders whenever parent re-renders.
// Its 100 PlainSubChild instances also re-render (cascade into sub-level).

export function PlainChild({ id }: { id: number }) {
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  const renderCount = renderCountRef.current;

  return (
    <div className="relative rounded border bg-white overflow-hidden flex flex-col select-none p-1 gap-0.5">
      <RenderFlash count={renderCount} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500">#{id}</span>
        <span className="text-[8px] font-medium text-orange-400">plain</span>
        <span className="text-[8px] text-gray-400 tabular-nums">
          ×{renderCount}
        </span>
      </div>

      {/* 100 sub-children — dots toggle green↔blue on every render */}
      <div className="relative z-10 flex flex-wrap gap-px content-start">
        {SUB_IDS.map((sid) => (
          <PlainSubChild key={sid} />
        ))}
      </div>
    </div>
  );
}

// ─── MemoChild ───────────────────────────────────────────────────────────────
// Wrapped in React.memo → bails out when props (id) are unchanged.
// Its 40 sub-children are NEVER called when MemoChild bails out —
// they stay frozen at initial green: proof they did NOT re-render.

export const MemoChild = memo(function MemoChild({ id }: { id: number }) {
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  const renderCount = renderCountRef.current;

  return (
    <div className="relative rounded border bg-white overflow-hidden flex flex-col select-none p-1 gap-0.5">
      <RenderFlash count={renderCount} />

      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-gray-500">#{id}</span>
        <span className="text-[8px] font-medium text-violet-500">memo</span>
        <span className="text-[8px] text-gray-400 tabular-nums">
          ×{renderCount}
        </span>
      </div>

      {/* Sub-children stay frozen at initial green — MemoChild bails out so they never re-render */}
      <div className="relative z-10 flex flex-wrap gap-px content-start">
        {SUB_IDS.map((sid) => (
          <PlainSubChild key={sid} />
        ))}
      </div>
    </div>
  );
});
