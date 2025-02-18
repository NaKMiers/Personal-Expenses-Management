import CurrencyBox from '@/components/CurrencyBox'
import Logo from '@/components/Logo'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

async function WizardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-between gap-4">
      <div>
        <h1 className="text-center text-3xl">
          Welcome, <span className="ml-2 font-bold">{user.firstName}! 👋</span>
        </h1>
        <h2 className="mt-4 text-center text-base text-slate-300">
          Let&apos;s get started by setting up your currency
        </h2>
        <h3 className="mt-2 text-center text-sm text-slate-300">
          You can change these setting at any time
        </h3>
      </div>

      <div className="h-px w-full border-t border-slate-200/30" />

      <CurrencyBox />

      <div className="h-px w-full border-t border-slate-200/30" />

      <Link
        href="/"
        className="trans-200 flex h-10 w-full items-center justify-center rounded-md border-2 border-light bg-white text-center text-sm font-semibold text-dark hover:bg-transparent hover:text-light"
      >
        I&apos;m done! Take me to the dashboard
      </Link>

      <Logo className="mt-8" />
    </div>
  )
}

export default WizardPage
