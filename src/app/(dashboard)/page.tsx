import { currentUser } from '@clerk/nextjs/server'
import CreateTransactionDialog from '../../components/CreateTransactionDialog'
import Overview from '@/components/Overview'
import UserSettingsModel, { IUserSettings } from '@/models/UserSettingsModel'
import { connectDatabase } from '@/config/database'
import { redirect } from 'next/navigation'
import { getUserSettingsApi } from '@/requests'

async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  let userSettings: IUserSettings | null = null
  let exchangeRate = 0

  try {
    // get user settings
    const { userSettings: uSettings } = await getUserSettingsApi(
      user.id,
      process.env.NEXT_PUBLIC_APP_URL
    )

    if (!uSettings) {
      redirect('/wizard')
    }

    userSettings = uSettings

    // get exchange rate for user's currency in real-time
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await res.json()
    exchangeRate = data.rates[uSettings.currency]
  } catch (err: any) {
    console.log(err)
  }

  return (
    <div className="w-full">
      <div className="border-b border-slate-200/30 bg-neutral-800/50">
        <div className="container flex flex-wrap items-center justify-between gap-6 px-21 py-8">
          <p className="text-xl font-bold">Hello, {user?.firstName} ! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              type="income"
              currency={userSettings?.currency || 'USD'}
              exchangeRate={exchangeRate}
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-emerald-500 bg-emerald-950 px-2 text-xs font-semibold hover:bg-emerald-700">
                  New Income 🤑
                </button>
              }
            />

            <CreateTransactionDialog
              type="expense"
              currency={userSettings?.currency || 'USD'}
              exchangeRate={exchangeRate}
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-rose-500 bg-rose-950 px-2 text-xs font-semibold hover:bg-rose-700">
                  New Expense 😕
                </button>
              }
            />
          </div>
        </div>
      </div>

      <div className="container">
        <Overview
          userSettings={userSettings}
          exchangeRate={exchangeRate}
        />
      </div>

      <div className="pt-80" />
    </div>
  )
}

export default DashboardPage
