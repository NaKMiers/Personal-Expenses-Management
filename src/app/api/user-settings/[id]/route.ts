import { connectDatabase } from '@/config/database'
import UserSettingsModel from '@/models/UserSettingsModel'
import { NextRequest, NextResponse } from 'next/server'

// Models: User Settings
import '@/models/UserSettingsModel'

export const dynamic = 'force-dynamic'

// [GET]: /user-settings/:id
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log('- Get User Settings -')

  try {
    // connect to database
    await connectDatabase()

    // get user id from params
    const { id } = await params

    // get user settings
    let userSettings = await UserSettingsModel.findOne({ userId: id }).lean()

    // create user settings if not exists
    if (!userSettings) {
      userSettings = await UserSettingsModel.create({
        userId: id,
        currency: 'USD',
      })
    }

    return NextResponse.json({ userSettings }, { status: 200 })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
