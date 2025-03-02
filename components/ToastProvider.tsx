"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--background, #ffffff)",
          color: "var(--dark-gray)",
          border: "1px solid var(--gray, #e5e5e5)",
        },
      }}
    />
  )
}

