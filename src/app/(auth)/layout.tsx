import Logo from '@/components/Logo'
import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex h-screen w-screen flex-col items-center justify-center">
      <Logo />
      <div className="mt-12">{children}</div>
    </main>
  )
}

export default layout
