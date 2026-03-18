import { useRenderCount } from '@/hooks/useRenderCount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Network } from 'lucide-react'
import { SubscribersGrid } from '@/components/ChildrenGrid'

// ─── SubscribersCard ──────────────────────────────────────────────────────────
//
// This card does NOT subscribe to any store slice — it NEVER re-renders after
// mount (render count stays at ×1 within a mode session).
// Its children (ContextChild, CardInfoChild) subscribe directly and re-render
// independently whenever their own slice changes, proving that direct subscribers
// don't need their parent to re-render.

export function SubscribersCard() {
  const renderCount = useRenderCount()

  return (
    <Card className="relative overflow-hidden">
      <div
        key={renderCount}
        className="pointer-events-none absolute inset-0 rounded-xl animate-[render-highlight_1s_ease-out_forwards]"
      />

      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Network className="size-4" />
            Direct Store Subscribers
            <span className="text-xs font-normal text-muted-foreground">
              (this card never re-renders — children do independently)
            </span>
          </CardTitle>
          <Badge variant="outline" className="text-xs tabular-nums">
            ×{renderCount} renders
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">
          <span className="text-blue-600 font-medium">ctx #1–20</span>{' '}
          subscribe to <code className="text-[10px]">user</code> via{' '}
          <code className="text-[10px]">useAppUser()</code> ·{' '}
          <span className="text-emerald-600 font-medium">card #21–40</span>{' '}
          subscribe to <code className="text-[10px]">userCardInfo</code> via{' '}
          <code className="text-[10px]">useAppUserCardInfo()</code>.{' '}
          In <strong>Zustand</strong> each group re-renders only for its own slice.
          In <strong>Context</strong> both groups re-render on any change.
        </p>
      </CardHeader>

      <Separator className="relative z-10" />

      <CardContent className="relative z-10 pt-3">
        <SubscribersGrid />
      </CardContent>
    </Card>
  )
}
