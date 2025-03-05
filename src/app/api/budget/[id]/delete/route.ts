import { connectDatabase } from '@/config/database'
import BudgetModel from '@/models/BudgetModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Budget
import '@/models/BudgetModel'

// [DELETE]: /budgets/:id/delete
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // connect to database
    await connectDatabase()

    // get budget id from params
    const { id } = await params

    // delete budget
    const deletedBudget = await BudgetModel.findByIdAndDelete(id).lean()

    // check if budget was found and deleted
    if (!deletedBudget) {
      return NextResponse.json({ message: 'Budget not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json({ deletedBudget, message: 'Budget deleted' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
