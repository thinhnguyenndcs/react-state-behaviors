import { createContext, useContext, useState, type ReactNode } from 'react'

export interface UserInfo {
  firstname: string
  lastname: string
  email: string
  phoneNumber: string
  address: string
}

export interface UserCardInfo {
  bio: string
  role: string
  company: string
  website: string
}

interface UserContextType {
  user: UserInfo
  userCardInfo: UserCardInfo
  setUser: (user: UserInfo) => void
  setUserCardInfo: (info: UserCardInfo) => void
}

const defaultUser: UserInfo = {
  firstname: '',
  lastname: '',
  email: '',
  phoneNumber: '',
  address: '',
}

const defaultUserCardInfo: UserCardInfo = {
  bio: '',
  role: '',
  company: '',
  website: '',
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserInfo>(defaultUser)
  const [userCardInfo, setUserCardInfo] = useState<UserCardInfo>(defaultUserCardInfo)

  // ⚠️  Both values live in the SAME context object.
  // Any change to either value produces a new object reference → every
  // useContext(UserContext) subscriber re-renders, even if it only reads
  // the field that did NOT change.
  return (
    <UserContext.Provider value={{ user, userCardInfo, setUser, setUserCardInfo }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within <UserProvider>')
  return ctx
}
