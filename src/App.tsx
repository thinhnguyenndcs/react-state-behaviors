import { UserProvider } from '@/contexts/UserContext'
import { UserCard } from '@/components/UserCard'
import { UserCardInfoDisplay } from '@/components/UserCardInfoDisplay'
import { SubscribersCard } from '@/components/SubscribersCard'
import { GuideDialog } from '@/components/GuideDialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { setStoreMode, useStoreMode, useStoreResetKey, type StoreMode } from '@/hooks/useAppStore'

// ─── Per-mode copy ────────────────────────────────────────────────────────────

const COPY: Record<StoreMode, { title: string; subtitle: string }> = {
  context: {
    title: 'React Context Behaviors',
    subtitle:
      'Both display cards share one context object — click "Change data" on either card and watch both re-render, ' +
      'even the unrelated one (⚠ indicator). Each card has 20 cascade children. ' +
      'Direct subscriber children in the Subscribers card below show the over-subscription effect.',
  },
  zustand: {
    title: 'React Zustand Behaviors',
    subtitle:
      'Each card subscribes only to its own slice via a selector — no cross-contamination. ' +
      'Click "Change data" and only the relevant card and its subscriber children re-render. ' +
      'Plain/memo children still cascade or bail out as expected.',
  },
}

// ─── Header (isolated so mode changes only re-render this subtree) ────────────

function AppHeader() {
  const mode = useStoreMode()
  const { title, subtitle } = COPY[mode]
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          <span className="text-xs text-muted-foreground font-medium">Store type:</span>
          <Select value={mode} onValueChange={v => setStoreMode(v as StoreMode)}>
            <SelectTrigger className="w-32" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="context">Context</SelectItem>
              <SelectItem value="zustand">Zustand</SelectItem>
            </SelectContent>
          </Select>
          <GuideDialog />
        </div>
      </div>
    </header>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
//
// UserProvider stays mounted at all times — each granular hook always calls
// useUser() internally (Rules of Hooks), so the Context is always needed.
// Switching the dropdown remounts the content area (key=resetKey) so all
// useRef-based render counters reset to zero.

function AppContent() {
  const resetKey = useStoreResetKey()
  return (
    <main key={resetKey} className="flex-1 overflow-y-auto p-5">
      <div className="grid grid-cols-2 gap-4">
        <UserCard />
        <UserCardInfoDisplay />
        <div className="col-span-2">
          <SubscribersCard />
        </div>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <UserProvider>
      <div className="max-h-screen bg-gray-50/60 flex flex-col">
        <AppHeader />
        <AppContent />
      </div>
    </UserProvider>
  )
}
