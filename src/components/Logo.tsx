import Link from 'next/link'
import { memo } from 'react'
import { LuPiggyBank } from 'react-icons/lu'

interface LogoProps {
  isMobile?: boolean
  className?: string
}

function Logo({ isMobile, className = '' }: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2 ${className}`}
    >
      {!isMobile && <LuPiggyBank className="stroke h-11 w-11 stroke-primary stroke-[1.5]" />}
      <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-bold text-transparent">
        PEM
      </p>
    </Link>
  )
}

export default memo(Logo)
