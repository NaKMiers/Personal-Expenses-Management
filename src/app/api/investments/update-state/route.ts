import { NextRequest, NextResponse } from 'next/server'
import { connectDatabase } from '@/config/database'
import { currentUser } from '@clerk/nextjs/server'
import TransactionModel from '@/models/TransactionModel'

export const dynamic = 'force-dynamic'

// [PUT] /api/investments/update-state
export async function PUT(req: NextRequest) {
  try {
    await connectDatabase()
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { transactionId, newState, metadata } = await req.json()

    // Validate input
    if (!transactionId || !newState) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Find the transaction
    const transaction = await TransactionModel.findOne({
      _id: transactionId,
      userId: user.id,
    })

    if (!transaction) {
      return NextResponse.json({ message: 'Investment not found or unauthorized' }, { status: 404 })
    }

    // Update transaction metadata
    transaction.metadata = {
      ...(transaction.metadata || {}),
      status: newState,
      ...metadata,
    }

    await transaction.save()

    return NextResponse.json(
      {
        message: 'Investment state updated successfully',
        transaction,
      },
      { status: 200 }
    )
  } catch (err: any) {
    console.error('Error updating investment state:', err)
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
