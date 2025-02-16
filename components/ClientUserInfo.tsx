'use client'

import { SignInButton, UserButton } from '@clerk/nextjs'
import { useUserData } from '@/hooks/useUserData'

export default function ClientUserInfo() {
  const { isSignedIn, user, isLoaded } = useUserData()

  if (!isLoaded) {
    return <div>Loading user info...</div>
  }

  return (
    <div>
      {isSignedIn && user ? (
        <>
          <p>Welcome, {user.firstName || 'User'}!</p>
          <UserButton />
        </>
      ) : (
        <div>
          <p>Please sign in.</p>
          <SignInButton />
        </div>
      )}
    </div>
  )
}
