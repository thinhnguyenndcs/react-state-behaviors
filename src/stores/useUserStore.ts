import { create } from 'zustand'
import type { UserInfo, UserCardInfo } from '@/contexts/UserContext'

interface UserStore {
  user: UserInfo
  userCardInfo: UserCardInfo
  setUser: (user: UserInfo) => void
  setUserCardInfo: (info: UserCardInfo) => void
}

// ─── Zustand store ────────────────────────────────────────────────────────────
//
// Unlike the Context approach (one object → all subscribers re-render on any
// change), Zustand uses selector-based subscriptions. Each component only
// re-renders when the slice it selected actually changes.
//
// e.g. useUserStore(s => s.user)        → only re-renders when `user` changes
//      useUserStore(s => s.userCardInfo) → only re-renders when `userCardInfo` changes
//
// This eliminates the "over-subscription" problem visible in Context mode.

export const useUserStore = create<UserStore>((set) => ({
  user: {
    firstname: '',
    lastname: '',
    email: '',
    phoneNumber: '',
    address: '',
  },
  userCardInfo: {
    bio: '',
    role: '',
    company: '',
    website: '',
  },
  setUser: (user) => set({ user }),
  setUserCardInfo: (userCardInfo) => set({ userCardInfo }),
}))
