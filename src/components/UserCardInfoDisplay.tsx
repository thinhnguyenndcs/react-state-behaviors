import { useRef } from 'react'
import { type UserCardInfo } from '@/contexts/UserContext'
import { useAppUserCardInfo, useAppSetUserCardInfo } from '@/hooks/useAppStore'
import { useRenderCount } from '@/hooks/useRenderCount'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { IdCard, Shuffle } from 'lucide-react'
import { CascadeGrid } from '@/components/ChildrenGrid'

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="flex gap-2 text-sm">
//       <span className="w-20 shrink-0 text-muted-foreground capitalize">{label}</span>
//       <span className="font-medium truncate">{value || '—'}</span>
//     </div>
//   )
// }

const BIOS = [
  'Senior engineer building scalable web applications for 10+ years.',
  'Full-stack developer passionate about performance and DX.',
  'Cloud architect specializing in distributed systems.',
  'Frontend lead with a love for design systems.',
  'Backend engineer focused on real-time data pipelines.',
  'Mobile-first developer crafting cross-platform experiences.',
]
const ROLES = ['Senior Software Engineer', 'Staff Engineer', 'Tech Lead', 'Principal Engineer', 'Engineering Manager', 'DevOps Engineer']
const COMPANIES = ['Tech Corp Inc.', 'Acme Labs', 'CloudNine', 'DataForge', 'PixelWorks', 'NovaSoft']
const WEBSITES = ['https://johndoe.dev', 'https://alicecodes.io', 'https://bobwrites.tech', 'https://devdiana.com', 'https://hackwitheve.dev', 'https://frank.engineer']

function randomCardInfo(): UserCardInfo {
  return {
    bio: BIOS[Math.floor(Math.random() * BIOS.length)],
    role: ROLES[Math.floor(Math.random() * ROLES.length)],
    company: COMPANIES[Math.floor(Math.random() * COMPANIES.length)],
    website: WEBSITES[Math.floor(Math.random() * WEBSITES.length)],
  }
}

// ─── UserCardInfoDisplay ──────────────────────────────────────────────────────
//
// Reads only `userCardInfo`, but subscribes to the full context object.
// When `user` changes (from UserInfoForm), this component ALSO re-renders
// even though it doesn't display any user data — the symmetric over-subscription
// problem to UserCard.
//
// Render breakdown:
//   ✓ from cardInfo  — renders where userCardInfo reference actually changed
//   ⚠ unrelated     — renders triggered by user changes (wasted work!)

export function UserCardInfoDisplay() {
  const userCardInfo = useAppUserCardInfo()   // in Context mode: subscribes to full context object
  const setUserCardInfo = useAppSetUserCardInfo()
  const renderCount = useRenderCount()

  const prevCardInfoRef = useRef<UserCardInfo | null>(null)
  const cardInfoRenderCount = useRef(0)
  const extraRenderCount = useRef(0)

  if (prevCardInfoRef.current === null) {
    // first render — skip
  } else if (prevCardInfoRef.current !== userCardInfo) {
    cardInfoRenderCount.current++   // userCardInfo actually changed ✓
  } else {
    extraRenderCount.current++      // re-rendered but cardInfo didn't change ⚠
  }
  prevCardInfoRef.current = userCardInfo

  return (
    <Card className="relative overflow-hidden">
      <div
        key={renderCount}
        className="pointer-events-none absolute inset-0 rounded-xl animate-[render-highlight_1s_ease-out_forwards]"
      />

      <CardHeader className="relative z-10 pb-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="flex items-center gap-2 text-sm">
            <IdCard className="size-4" />
            User Card Info
            <span className="text-xs font-normal text-muted-foreground">(reads cardInfo only)</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs tabular-nums">
              ×{renderCount} renders
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setUserCardInfo(randomCardInfo())}>
              <Shuffle className="size-3" />
              Change data
            </Button>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap mt-1">
          <span className="text-[11px] font-medium text-emerald-600">
            ✓ from cardInfo: ×{cardInfoRenderCount.current}
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

      {/* <CardContent className="relative z-10 space-y-1">
        <InfoRow label="Bio"     value={userCardInfo.bio}     />
        <InfoRow label="Role"    value={userCardInfo.role}    />
        <InfoRow label="Company" value={userCardInfo.company} />
        <InfoRow label="Website" value={userCardInfo.website} />
      </CardContent> */}
    </Card>
  )
}
