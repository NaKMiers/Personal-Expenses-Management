import { connectDatabase } from '@/config/database'
import BudgetModel from '@/models/BudgetModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /api/
export async function GET(req: NextRequest) {
  console.log('- Get User Budget Data -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not logged in
    if (!user) {
      redirect('/sign-in')
    }

    // get type from search params
    const { searchParams } = new URL(req.nextUrl)
    const type = searchParams.get('type')
    const categoryId = searchParams.get('categoryId')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Convert startDate and endDate only if they are not null
    const startDate = startDateParam ? new Date(startDateParam) : undefined
    const endDate = endDateParam ? new Date(endDateParam) : undefined

    // build filter object
    const filter: any = { userId: user.id }

    // apply filters if provided
    if (type) {
      filter.type = type
    }
    if (categoryId) {
      filter.categoryId = categoryId
    }
    if (startDate && endDate) {
      filter.startDate = { $gte: startDate }
      filter.endDate = { $lte: endDate }
    }

    // get user budget data
    const budgets = await BudgetModel.find(filter).lean()

    // return response
    return NextResponse.json({ budgets, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
