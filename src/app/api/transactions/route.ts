import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import TransactionModel from '@/models/TransactionModel'

// Models: Transaction, Category
import '@/models/TransactionModel'
import '@/models/CategoryModel'

export const dynamic = 'force-dynamic'

// [GET]: /transactions
export async function GET(req: NextRequest) {
  console.log('- Get Transactions -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // get user transactions
    const transactions = await TransactionModel.find({ userId: user.id })
      .populate('category')
      .sort({ createdAt: -1 })
      .lean()

    // return response
    return NextResponse.json({ transactions, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
