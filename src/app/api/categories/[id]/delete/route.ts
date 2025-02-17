import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [DELETE]: /categories/:id/delete
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // delete category
    const deletedCategory = await CategoryModel.findByIdAndDelete(params.id).lean()

    // return response
    return NextResponse.json({ deletedCategory, message: 'Category deleted' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
