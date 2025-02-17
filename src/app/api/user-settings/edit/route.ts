import { connectDatabase } from '@/config/database'
import UserSettingsModel from '@/models/UserSettingsModel'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

// Models: User Settings
import '@/models/UserSettingsModel'

// [PUT]: /user-settings/edit
export async function PUT(req: NextRequest) {
  console.log('- Edit User Settings -')

  try {
    // connect to database
    await connectDatabase()

    // get current user
    const user = await currentUser()

    // check if user is not logged in
    if (!user) {
      redirect('/sign-in')
    }

    // get request body
    const { currency } = await req.json()

    // update user settings
    const updatedUserSettings = await UserSettingsModel.findOneAndUpdate(
      { userId: user.id },
      { $set: { currency } },
      { new: true }
    )

    // return response
    return NextResponse.json({ updatedUserSettings, message: '' }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
