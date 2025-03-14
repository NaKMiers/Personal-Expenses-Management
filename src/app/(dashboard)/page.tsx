'use client'

import CreateTransactionDialog from '@/components/CreateTransactionDialog'
import Overview from '@/components/Overview'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

function DashboardPage() {
  // hooks
  const { user } = useUser()
  const router = useRouter()

  return (
    <div>
      <div className="border-b border-slate-200/30 bg-neutral-800/50">
        <div className="container flex flex-wrap items-center justify-between gap-6 px-21 py-8">
          <p className="text-xl font-bold">Hello, {user?.firstName} ! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              type="income"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-emerald-500 bg-emerald-950 px-2 text-xs font-semibold hover:bg-emerald-700">
                  New Income 🤑
                </button>
              }
              refresh={() => router.refresh()}
            />

            <CreateTransactionDialog
              type="expense"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-rose-500 bg-rose-950 px-2 text-xs font-semibold hover:bg-rose-700">
                  New Expense 😕
                </button>
              }
              refresh={() => router.refresh()}
            />
            <CreateTransactionDialog
              type="investment"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-yellow-500 bg-yellow-950 px-2 text-xs font-semibold hover:bg-yellow-700">
                  New Investment 📈
                </button>
              }
              refresh={() => router.refresh()}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <Overview />
      </div>

      <div className="pt-80" />
    </div>
  )
}

export default DashboardPage
