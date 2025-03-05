import { connectDatabase } from '@/config/database'
import BudgetModel from '@/models/BudgetModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: Budget
import '@/models/BudgetModel'

// [POST]: /budget/create
export async function POST(req: NextRequest) {
  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // get budget data from request body
    const { type, categoryId, amount, startDate, endDate } = await req.json()

    // validate required fields
    if (!type || !categoryId || !amount || !startDate || !endDate) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
    }

    // create budget
    const budget = await BudgetModel.create({
      type,
      categoryId,
      userId: user.id,
      amount,
      startDate,
      endDate,
    })

    // return response
    return NextResponse.json({ budget, message: 'Budget created successfully' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
