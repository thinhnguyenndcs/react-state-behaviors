import { useMemo } from 'react'
import { ContextChild, PlainChild, MemoChild, CardInfoChild } from './ChildComponent'

function SectionLabel({ color, label, description }: {
  color: string
  label: string
  description: string
}) {
  return (
    <div className={`text-[10px] font-semibold px-1 py-0.5 rounded ${color} col-span-full`}>
      {label} — <span className="font-normal opacity-80">{description}</span>
    </div>
  )
}

// ─── CascadeGrid ──────────────────────────────────────────────────────────────
// 20 children with no store subscriptions:
//   • #1–10  PlainChild — cascades when parent re-renders
//   • #11–20 MemoChild  — bails out when props unchanged

export function CascadeGrid() {
  const plainIds = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 1),  [])
  const memoIds  = useMemo(() => Array.from({ length: 10 }, (_, i) => i + 11), [])

  return (
    <div className="space-y-2">
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))' }}>
        <SectionLabel
          color="text-orange-600 bg-orange-50"
          label="#1–10 · plain"
          description="no memo → re-renders when parent re-renders (cascade)"
        />
        {plainIds.map(id => <PlainChild key={id} id={id} />)}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))' }}>
        <SectionLabel
          color="text-violet-600 bg-violet-50"
          label="#11–20 · memo"
          description="React.memo → bails out when props unchanged"
        />
        {memoIds.map(id => <MemoChild key={id} id={id} />)}
      </div>
    </div>
  )
}

// ─── SubscribersGrid ──────────────────────────────────────────────────────────
// 40 direct store-subscriber children:
//   • #1–20  ContextChild  — calls useAppUser()
//   • #21–40 CardInfoChild — calls useAppUserCardInfo()
//
// In Zustand mode each group re-renders only for its own slice.
// In Context mode both groups re-render on any context change.

export function SubscribersGrid() {
  const ctxIds      = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 1),  [])
  const cardInfoIds = useMemo(() => Array.from({ length: 20 }, (_, i) => i + 21), [])

  return (
    <div className="space-y-2">
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))' }}>
        <SectionLabel
          color="text-blue-600 bg-blue-50"
          label="#1–20 · ctx"
          description="useAppUser() → re-renders on user change (Zustand) or any change (Context)"
        />
        {ctxIds.map(id => <ContextChild key={id} id={id} />)}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))' }}>
        <SectionLabel
          color="text-emerald-600 bg-emerald-50"
          label="#21–40 · card"
          description="useAppUserCardInfo() → re-renders on cardInfo change (Zustand) or any change (Context)"
        />
        {cardInfoIds.map(id => <CardInfoChild key={id} id={id} />)}
      </div>
    </div>
  )
}
