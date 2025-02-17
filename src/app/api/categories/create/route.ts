import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: Category
import '@/models/CategoryModel'

// [POST]: /categories/create
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

    // get category data from request body
    const { name, icon, type } = await req.json()

    console.log('category data:', { name, icon, type })

    // create category
    const category = await CategoryModel.create({
      name,
      icon,
      type,
      userId: user.id,
    })

    // return response
    return NextResponse.json({ category, message: 'Category created' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
