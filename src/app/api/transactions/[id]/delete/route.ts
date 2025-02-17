import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import TransactionModel, { ITransaction } from '@/models/TransactionModel'

// Models: Transaction
import '@/models/TransactionModel'

export const dynamic = 'force-dynamic'

// [PUT]: /transactions/:id/delete
export async function PUT(req: NextRequest, { params: { id } }: { params: { id: string } }) {
  console.log('- Delete Transaction -')

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

    // delete transaction
    const deletedTransaction = await TransactionModel.findByIdAndDelete(id)

    // return response
    return NextResponse.json({ deletedTransaction, message: 'Transaction deleted' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
