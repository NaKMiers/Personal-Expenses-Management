import { connectDatabase } from '@/config/database'
import UserSettingsModel from '@/models/UserSettingsModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

// Models: User Settings
import '@/models/UserSettingsModel'

export const dynamic = 'force-dynamic'

// [GET]: /user-settings
export async function GET() {
  console.log('- Get User Settings -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not logged in
    if (!user) {
      redirect('/sign-in')
    }

    // get user settings
    let userSettings = await UserSettingsModel.findOne({ userId: user.id }).lean()

    // create user settings if not exists
    if (!userSettings) {
      userSettings = await UserSettingsModel.create({
        userId: user.id,
        currency: 'USD',
      })
    }

    return NextResponse.json({ userSettings }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
