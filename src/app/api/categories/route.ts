import { connectDatabase } from '@/config/database'
import CategoryModel from '@/models/CategoryModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// [GET]: /api/categories
export async function GET(req: NextRequest) {
  console.log('- Get User Categories -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not logged in
    if (!user) {
      redirect('/sign-in')
    }

    // get type from search params
    const { searchParams } = new URL(req.nextUrl)
    const type = searchParams.get('type')

    // get user categories
    const categories = await CategoryModel.find({ userId: user.id, type }).lean()

    // return response
    return NextResponse.json({ categories, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
