import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [PUT]: /categories/:id/edit
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not found
    if (!user) {
      redirect('/sign-in')
    }

    // get category id from params
    const { id } = await params

    // get category data from request body
    const { name, icon, type } = await req.json()

    // update category
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { name, icon, type } },
      { new: true }
    ).lean()

    // return response
    return NextResponse.json({ updatedCategory, message: 'Category updated' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
