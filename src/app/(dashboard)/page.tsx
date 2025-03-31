'use client'

import CreateBudgetForm from '@/components/CreateBudgetForm'
import CreateTransactionDialog from '@/components/CreateTransactionDialog'
import Overview from '@/components/Overview'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function DashboardPage() {
  // hooks
  const { user } = useUser()
  const router = useRouter()
  const [refetch, setRefresh] = useState<number>(new Date().getTime())

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
              refresh={() => setRefresh(new Date().getTime())}
            />

            <CreateTransactionDialog
              type="expense"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-rose-500 bg-rose-950 px-2 text-xs font-semibold hover:bg-rose-700">
                  New Expense 😕
                </button>
              }
              refresh={() => setRefresh(new Date().getTime())}
            />
            <CreateTransactionDialog
              type="investment"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-yellow-500 bg-yellow-950 px-2 text-xs font-semibold hover:bg-yellow-700">
                  New Investment 📈
                </button>
              }
              refresh={() => setRefresh(new Date().getTime())}
            />
            <CreateBudgetForm
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-blue-500 bg-blue-950 px-2 text-xs font-semibold hover:bg-blue-700">
                  New Budget 🎁
                </button>
              }
              refresh={() => setRefresh(new Date().getTime())}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <Overview refetch={refetch} />
      </div>

      <div className="pt-40" />
    </div>
  )
}

export default DashboardPage
