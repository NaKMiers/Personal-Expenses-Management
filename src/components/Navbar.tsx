'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from './Logo'
import { UserButton, useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { LuMenu, LuX } from 'react-icons/lu'
import { AnimatePresence, motion } from 'framer-motion'

function Navbar() {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
    </>
  )
}

const items = [
  {
    label: 'Dashboard',
    link: '/',
  },
  {
    label: 'Transactions',
    link: '/transactions',
  },
  {
    label: 'Manage',
    link: '/manage',
  },
]

function DesktopNavbar() {
  // get user
  const { user, isSignedIn } = useUser()

  return (
    <div className="hidden border-b border-slate-200/20 md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {items.map(item => (
              <NavbarItem
                label={item.label}
                link={item.link}
                key={item.link}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="mr-2 flex h-7 flex-shrink-0 items-center justify-center rounded-md bg-white px-2 text-xs font-semibold text-dark"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}

function MobileNavbar() {
  // get user
  const { isSignedIn } = useUser()

  // states
  const [open, setOpen] = useState<boolean>(false)

  return (
    <div className="block border-b border-slate-200/20 md:hidden">
      <nav className="flex p-2">
        <div className="flex w-full items-center gap-21">
          <button
            onClick={() => setOpen(!open)}
            className="trans-200 rounded-md p-2 hover:bg-slate-200/30"
          >
            <LuMenu size={24} />
          </button>

          <Logo isMobile />
        </div>

        <div className="mr-2 flex items-center gap-2">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <Link
              href="/sign-in"
              className="mr-2 flex h-7 flex-shrink-0 items-center justify-center rounded-md bg-white px-2 text-xs font-semibold text-dark"
            >
              Sign In
            </Link>
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 z-50 h-screen w-[95%] bg-neutral-950 shadow-lg"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center justify-between gap-21 p-21/2">
                <Logo />
                <button
                  onClick={() => setOpen(!open)}
                  className="trans-200 rounded-md p-1 hover:bg-slate-200/30"
                >
                  <LuX size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2 p-2">
                {items.map(item => (
                  <NavbarItem
                    label={item.label}
                    link={item.link}
                    key={item.link}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  )
}

function NavbarItem({ label, link }: { label: string; link: string }) {
  const pathname = usePathname()
  const isActive = pathname === link

  return (
    <div className="trans-200 relative flex items-center">
      <Link
        href={link}
        className={`trans-200 w-full rounded-md px-21/2 py-0.5 font-semibold hover:bg-slate-200/30 ${isActive ? 'text-primary' : ''}`}
      >
        {label}
      </Link>
    </div>
  )
}

export default Navbar
