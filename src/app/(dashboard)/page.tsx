import { currentUser } from '@clerk/nextjs/server'
import CreateTransactionDialog from '../../components/CreateTransactionDialog'

async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="px-21/2 md:px-21 w-full">
      <div className="border-b border-slate-200/30">
        <div className="flex flex-wrap items-center justify-between gap-6 py-8">
          <p className="text-xl font-bold">Hello, {user?.firstName} ! 👋</p>

          <div className="flex items-center gap-3">
            <CreateTransactionDialog
              type="income"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-emerald-500 bg-emerald-950 px-2 text-xs font-semibold hover:bg-emerald-700">
                  New Income 🤑
                </button>
              }
            />

            <CreateTransactionDialog
              type="expense"
              trigger={
                <button className="trans-200 h-8 rounded-md border-2 border-rose-500 bg-rose-950 px-2 text-xs font-semibold hover:bg-rose-700">
                  New Expense 😕
                </button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
