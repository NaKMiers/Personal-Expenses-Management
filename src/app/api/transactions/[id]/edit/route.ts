import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import TransactionModel, { ITransaction } from '@/models/TransactionModel'

// Models: Transaction
import '@/models/TransactionModel'

export const dynamic = 'force-dynamic'

// [PUT]: /transactions/:id/edit
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Edit Transaction -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // get transaction to check authorization
    const transaction: any = await TransactionModel.findById(id).lean()

    // check if transaction is not found
    if (!transaction) {
      return NextResponse.json({ message: 'Transaction not found' }, { status: 404 })
    }

    // check if user is not authorized
    if (transaction.userId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // get transaction data from request body
    const { description, amount, category, date, type } = await req.json()

    // create new transaction
    const updatedTransaction = await TransactionModel.findByIdAndUpdate(id, {
      amount,
      description,
      date,
      userId: user.id,
      type,
      category,
    })

    // return response
    return NextResponse.json({ updatedTransaction, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
