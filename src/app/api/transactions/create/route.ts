import { connectDatabase } from '@/config/database'
import TransactionModel from '@/models/TransactionModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: Transaction
import '@/models/TransactionModel'

// [POST]: /transactions/create
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

    // get transaction data from request body
    const { description, amount, category, date, type } = await req.json()

    // create new transaction
    const transaction = await TransactionModel.create({
      amount,
      description,
      date,
      userId: user.id,
      type,
      category,
    })

    // return response
    return NextResponse.json({ transaction, message: 'Category created' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
