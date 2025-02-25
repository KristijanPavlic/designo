'use client'

import { useUser } from '@clerk/nextjs'

export function useUserData() {
  const { isSignedIn, user, isLoaded } = useUser()
  return { isSignedIn, user, isLoaded }
}
