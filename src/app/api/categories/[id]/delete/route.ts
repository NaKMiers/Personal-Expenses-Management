import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { NextRequest, NextResponse } from 'next/server'

import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

// Models: Category, TransactionModel
import '@/models/CategoryModel'
import '@/models/TransactionModel'
import TransactionModel from '@/models/TransactionModel'

// [DELETE]: /categories/:id/delete
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // connect to database
    await connectDatabase()

    // get id from params
    const { id } = await params

    // only allow to delete category if no transactions are associated with it
    const transactionExists = await TransactionModel.exists({ category: id })
    if (transactionExists) {
      return NextResponse.json({ message: 'Cannot delete category with transactions' }, { status: 400 })
    }

    // delete category
    const deletedCategory = await CategoryModel.findByIdAndDelete(id).lean()

    // return response
    return NextResponse.json({ deletedCategory, message: 'Category deleted' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
