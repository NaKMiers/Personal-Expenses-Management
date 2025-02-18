import Navbar from '@/components/Navbar'
import UseSettings from '@/hooks/useSettings'
import { ReactNode } from 'react'

function layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex h-screen w-full flex-col">
      <UseSettings />
      <Navbar />
      <div className="w-full">{children}</div>
    </main>
  )
}

export default layout
