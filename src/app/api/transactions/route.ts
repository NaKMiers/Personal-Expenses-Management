import { connectDatabase } from '@/config/database'
import TransactionModel from '@/models/TransactionModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'
import { toUTC } from '@/lib/utils'

// Models: Transaction, Category
import '@/models/CategoryModel'
import '@/models/TransactionModel'

export const dynamic = 'force-dynamic'

// [GET]: /transactions
export async function GET(req: NextRequest) {
  console.log('- Get Transactions -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is logged in
    if (!user) {
      redirect('/sign-in')
    }

    const { searchParams } = new URL(req.nextUrl)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    if (!from || !to) {
      return NextResponse.json({ message: 'Invalid date range' }, { status: 400 })
    }

    // MARK: Overview
    const transactions = await TransactionModel.find({
      userId: user.id,
      date: {
        $gte: toUTC(from),
        $lte: toUTC(to),
      },
    })
      .sort({ createdAt: -1 })
      .populate('category')
      .lean()

    // return response
    return NextResponse.json({ transactions, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
