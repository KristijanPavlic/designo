'use client'

import { UserButton } from '@clerk/nextjs'
import { useUserData } from '@/hooks/useUserData'

export default function ClientUserInfo() {
  const { isSignedIn, user, isLoaded } = useUserData()

  if (!isLoaded) {
    return <div>Loading user info...</div>
  }

  return (
    <div>
      {isSignedIn && user ? (
        <div className="flex items-center gap-2">
          <p className="text-lg text-[var(--dark-gray)] md:text-xl xl:text-3xl">
            {user.firstName || 'User'}
          </p>
          <UserButton />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}
