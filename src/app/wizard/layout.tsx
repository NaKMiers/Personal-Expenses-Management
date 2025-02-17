import React, { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex h-screen w-full flex-col items-center justify-center px-21/2 md:px-21">
      {children}
    </main>
  )
}

export default layout
