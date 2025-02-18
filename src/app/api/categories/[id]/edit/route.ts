import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import TransactionModel from '@/models/TransactionModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category, Transaction
import '@/models/CategoryModel'
import '@/models/TransactionModel'

// [PUT]: /categories/:id/edit
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // connect to database
    await connectDatabase()

    // get category id from params
    const { id } = await params

    // get category data from request body
    const { name, icon, type } = await req.json()

    // update category
    const updatedCategory: any = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { name, icon, type } },
      { new: true }
    ).lean()

    // check if category is not found
    if (!updatedCategory) {
      return NextResponse.json({ message: 'Category not found' }, { status: 404 })
    }

    // update all transactions related to this category
    await TransactionModel.updateMany({ category: id }, { $set: { type: updatedCategory.type } })

    // return response
    return NextResponse.json({ updatedCategory, message: 'Category updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
