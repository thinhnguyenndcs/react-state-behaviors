import { useRef } from 'react'
import { type UserInfo } from '@/contexts/UserContext'
import { useAppUser, useAppSetUser } from '@/hooks/useAppStore'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { User, Shuffle } from 'lucide-react'
import { CascadeGrid } from '@/components/ChildrenGrid'

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex gap-2 text-sm">
//       <span className="w-24 shrink-0 text-muted-foreground">{label}</span>
//       <span className="font-medium truncate">{value || '—'}</span>
//     </div>
//   )
// }

const FIRST_NAMES = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore']
const CITIES = ['San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Chicago, IL', 'Denver, CO', 'Portland, OR', 'Boston, MA']

function randomUser(): UserInfo {
  const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
  return {
    firstname: first,
    lastname: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    phoneNumber: `+1 ${Math.floor(200 + Math.random() * 800)} ${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000 + Math.random() * 9000)}`,
    address: `${Math.floor(100 + Math.random() * 9900)} Main St, ${CITIES[Math.floor(Math.random() * CITIES.length)]}`,
  }
}

// ─── UserCard ─────────────────────────────────────────────────────────────────
//
// Reads only `user` from context, but BOTH values live in the same context object.
// Any change to the context (including userCardInfo) produces a new object
// reference → useContext re-renders this component even when `user` didn't change.
//
// Render breakdown shows:
//   ✓ from user    — renders where user reference actually changed
//   ⚠ unrelated   — renders triggered by userCardInfo changes (wasted work!)

export function UserCard() {
  const user = useAppUser()   // in Context mode: subscribes to full context object
  const setUser = useAppSetUser()
  const renderCount = useRenderCount()

  // Track expected vs. unexpected re-renders
  const prevUserRef = useRef<UserInfo | null>(null)
  const userRenderCount = useRef(0)
  const extraRenderCount = useRef(0)

  if (prevUserRef.current === null) {
    // first render — don't count yet
  } else if (prevUserRef.current !== user) {
    userRenderCount.current++     // user actually changed ✓
  } else {
    extraRenderCount.current++    // re-rendered but user didn't change ⚠
  }
  prevUserRef.current = user

  return (
    <Card className="relative overflow-hidden">
      <div
        key={renderCount}
        className="pointer-events-none absolute inset-0 rounded-xl animate-[render-highlight_1s_ease-out_forwards]"
      />

      {/* ── Header ── */}
      <CardHeader className="relative z-10 pb-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="size-4" />
            User Info
            <span className="text-xs font-normal text-muted-foreground">(reads user only)</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs tabular-nums">
              ×{renderCount} renders
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setUser(randomUser())}>
              <Shuffle className="size-3" />
              Change data
            </Button>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap mt-1">
          <span className="text-[11px] font-medium text-emerald-600">
            ✓ from user: ×{userRenderCount.current}
          </span>
          {extraRenderCount.current > 0 && (
            <span className="text-[11px] font-medium text-amber-500">
              ⚠ unrelated context change: ×{extraRenderCount.current}
            </span>
          )}
        </div>
      </CardHeader>
      
      {/* ── 20 children (plain cascade + memo bailout) ── */}
      <CardContent className="relative z-10 space-y-3 pt-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            20 children · 100 sub-children each
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            <span className="text-orange-500 font-medium">plain #1–10</span> cascade when this card re-renders ·{' '}
            <span className="text-violet-500 font-medium">memo #11–20</span> bail out even when this card re-renders
          </p>
        </div>
        <CascadeGrid />
      </CardContent>

      {/* <Separator className="relative z-10" /> */}

      {/* ── User info display ── */}
      {/* <CardContent className="relative z-10 space-y-1">
        <InfoRow label="First name" value={user.firstname}   />
        <InfoRow label="Last name"  value={user.lastname}    />
        <InfoRow label="Email"      value={user.email}       />
        <InfoRow label="Phone"      value={user.phoneNumber} />
        <InfoRow label="Address"    value={user.address}     />
      </CardContent> */}
    </Card>
  )
}
