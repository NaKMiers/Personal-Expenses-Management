import { connectDatabase } from '@/config/database'
import { toUTC } from '@/lib/utils'
import BudgetModel from '@/models/BudgetModel'
import TransactionModel from '@/models/TransactionModel'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

// [GET]: /api/budgets
export async function GET(req: NextRequest) {
  try {
    // Kết nối database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // Lấy danh sách ngân sách từ database
    let budgets: any[] = await BudgetModel.find({ userId: user.id }).lean()

    // get transaction of each budget by time
    budgets = await Promise.all(
      budgets.map(async budget => {
        const transactions = await TransactionModel.find({
          date: { $gte: toUTC(budget.startDate), $lte: toUTC(budget.endDate) },
        })
        const spentAmount = transactions.reduce((total, transaction) => {
          return total + transaction.amount
        }, 0)
        return { ...budget, spentAmount }
      })
    )

    // Trả về response
    return NextResponse.json({ budgets }, { status: 200 })
  } catch (err: any) {
    // Xử lý lỗi
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
