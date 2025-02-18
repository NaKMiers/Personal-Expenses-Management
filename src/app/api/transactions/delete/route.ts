import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import TransactionModel, { ITransaction } from '@/models/TransactionModel'

// Models: Transaction
import '@/models/TransactionModel'

export const dynamic = 'force-dynamic'

// [DELETE]: /transactions/
export async function DELETE(req: NextRequest) {
  console.log('- Delete Transactions -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // get transaction ids to delete
    const { ids } = await req.json()
    console.log('ids:', ids)

    // get delete transactions
    const deletedTransactions = await TransactionModel.find({ _id: { $in: ids } }).lean()

    // delete transactions
    await TransactionModel.deleteMany({ _id: { $in: ids } })

    // return response
    return NextResponse.json(
      {
        deletedTransactions,
        message: `${deletedTransactions.length} ${deletedTransactions.length === 1 ? 'transaction' : 'transaction'} ${deletedTransactions.length === 1 ? 'has' : 'have'} been deleted!`,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
