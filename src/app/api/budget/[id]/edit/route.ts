import { connectDatabase } from '@/config/database'
import BudgetModel from '@/models/BudgetModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Budget
import '@/models/BudgetModel'

// [PUT]: /budgets/:id/edit
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // connect to database
    await connectDatabase()

    // get budget id from params
    const { id } = await params

    // get budget data from request body
    const { type, categoryId, amount, startDate, endDate } = await req.json()

    // update budget
    const updatedBudget = await BudgetModel.findByIdAndUpdate(
      id,
      { $set: { type, categoryId, amount, startDate, endDate } },
      { new: true }
    ).lean()

    // check if budget is not found
    if (!updatedBudget) {
      return NextResponse.json({ message: 'Budget not found' }, { status: 404 })
    }

    // return response
    return NextResponse.json({ updatedBudget, message: 'Budget updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
