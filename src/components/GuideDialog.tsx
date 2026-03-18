import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

const GUIDE_SEEN_KEY = 'rcb-guide-seen'

// ─── GuideDialog ──────────────────────────────────────────────────────────────
//
// Auto-opens on first visit (localStorage flag). Subsequent visits only open
// when the user clicks the Guide button.

export function GuideDialog() {
  const [open, setOpen] = useState(() => {
    try { return !localStorage.getItem(GUIDE_SEEN_KEY) } catch { return false }
  })

  function handleOpenChange(value: boolean) {
    setOpen(value)
    if (!value) {
      try { localStorage.setItem(GUIDE_SEEN_KEY, '1') } catch {}
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-6xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How this app works</DialogTitle>
          <DialogDescription>
            A live visualizer for React re-render behavior — compare React Context vs Zustand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 text-sm">

          {/* ── Store Modes ── */}
          <section>
            <h3 className="font-semibold mb-2">Store Modes</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-blue-100 bg-blue-50/60 p-3 space-y-1.5">
                <p className="font-medium text-blue-700 text-xs uppercase tracking-wide">Context mode</p>
                <p className="text-xs text-muted-foreground">
                  <code>user</code> and <code>userCardInfo</code> share{' '}
                  <strong>one context object</strong>. Any change creates a new object reference —
                  every consumer re-renders, even those that only read the other value.
                  This is the <strong>over-subscription problem</strong>.
                </p>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50/60 p-3 space-y-1.5">
                <p className="font-medium text-green-700 text-xs uppercase tracking-wide">Zustand mode</p>
                <p className="text-xs text-muted-foreground">
                  Each hook subscribes to its own slice via a{' '}
                  <strong>selector</strong> (e.g. <code>s =&gt; s.user</code>).
                  Changing <code>userCardInfo</code> only re-renders components subscribed to it —
                  no wasted renders.
                </p>
              </div>
            </div>
          </section>

          {/* ── App Layout ── */}
          <section>
            <h3 className="font-semibold mb-2">App Layout</h3>
            <div className="space-y-1.5 text-xs">
              {[
                ['User Info Card', 'Reads user only. Has a "Change data" button to set random user data. Shows ✓ expected vs ⚠ unrelated render counters. Contains 20 cascade children.'],
                ['Card Info Card', 'Reads userCardInfo only. Has a "Change data" button to set random card info. Symmetric to above. Contains 20 cascade children.'],
                ['Subscribers Card', 'Full-width card below. Contains 20 direct subscriber children that re-render independently of their parent.'],
              ].map(([label, desc]) => (
                <div key={label} className="flex gap-2">
                  <span className="w-36 shrink-0 font-medium text-foreground">{label}</span>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Child Types ── */}
          <section>
            <h3 className="font-semibold mb-2">Child Types</h3>
            <div className="space-y-2">
              {[
                {
                  badge: 'ctx',
                  color: 'bg-blue-50 text-blue-600',
                  text: <>Calls <code>useAppUser()</code>. In Zustand re-renders only when <code>user</code> changes. In Context re-renders on any context change.</>,
                },
                {
                  badge: 'card',
                  color: 'bg-emerald-50 text-emerald-600',
                  text: <>Calls <code>useAppUserCardInfo()</code>. In Zustand re-renders only when <code>userCardInfo</code> changes. In Context re-renders on any context change.</>,
                },
                {
                  badge: 'plain',
                  color: 'bg-orange-50 text-orange-600',
                  text: <>No <code>React.memo</code>, no store subscription. Re-renders every time its <strong>parent re-renders</strong> — the cascade effect.</>,
                },
                {
                  badge: 'memo',
                  color: 'bg-violet-50 text-violet-600',
                  text: <>Wrapped in <code>React.memo</code>. <strong>Bails out</strong> when props haven't changed, even if the parent re-renders.</>,
                },
              ].map(({ badge, color, text }) => (
                <div key={badge} className="flex gap-3 items-start">
                  <span className={`inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${color}`}>
                    {badge}
                  </span>
                  <span className="text-xs text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Visual Indicators ── */}
          <section>
            <h3 className="font-semibold mb-2">Visual Indicators</h3>
            <div className="space-y-2 text-xs">
              <div className="flex gap-3 items-start">
                <span className="inline-block mt-0.5 size-3 rounded shrink-0 bg-green-400/70" />
                <span className="text-muted-foreground">
                  <strong>Green flash</strong> — a card or child just rendered. The animation restarts on every render.
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <code className="mt-0.5 shrink-0 text-muted-foreground">×N</code>
                <span className="text-muted-foreground">
                  Cumulative <strong>render count</strong> since mount (or last mode switch which resets all counts).
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <span className="flex items-center gap-0.5 shrink-0 mt-0.5">
                  <span className="inline-block w-2 h-2 rounded-sm bg-green-300/80" />
                  <span className="text-muted-foreground text-[10px]">/</span>
                  <span className="inline-block w-2 h-2 rounded-sm bg-blue-300/80" />
                </span>
                <span className="text-muted-foreground">
                  <strong>Sub-child dots</strong> — each child has 100 tiny dots that toggle green↔blue every render. Frozen dots mean no render occurred.
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <code className="mt-0.5 shrink-0 text-emerald-600 text-[11px]">✓ from X</code>
                <span className="text-muted-foreground">Renders where the subscribed value <strong>actually changed</strong> (expected work).</span>
              </div>
              <div className="flex gap-3 items-start">
                <code className="mt-0.5 shrink-0 text-amber-500 text-[11px]">⚠ unrelated</code>
                <span className="text-muted-foreground">Renders triggered by an <strong>unrelated context change</strong> — wasted work caused by over-subscription. Disappears in Zustand mode.</span>
              </div>
            </div>
          </section>

          {/* ── Try This ── */}
          <section>
            <h3 className="font-semibold mb-2">Try This</h3>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-muted-foreground">
              <li>
                Select <strong>Context</strong>, click <strong>"Change data"</strong> on the User Info card — watch <em>both</em> display cards flash and the ⚠ counter appear on Card Info.
              </li>
              <li>
                Select <strong>Zustand</strong>, same action — only User Info Card and its{' '}
                <span className="text-blue-600 font-medium">ctx</span> Subscriber children flash. Card Info Card stays silent.
              </li>
              <li>
                Watch the <span className="text-orange-500 font-medium">plain</span> children always cascade from their parent while{' '}
                <span className="text-violet-500 font-medium">memo</span> children stay frozen.
              </li>
              <li>
                The <strong>Subscribers Card</strong> (below) shows ×1 renders — it never re-renders itself. Only its direct subscriber children do, independently.
              </li>
            </ol>
          </section>

        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
