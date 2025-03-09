'use client'

import { UserSettingsApis } from '@/patterns/proxies/UserSettingsApiProxy'
import { setUserSettings } from '@/reducers/settingsReducer'
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '.'

function UseSettings() {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const settings = useAppSelector(state => state.settings)

  useEffect(() => {
    const getUserSettings = async () => {
      if (!user) return

      try {
        // get user settings
        const { userSettings: uSettings } = await UserSettingsApis.getUserSettingsApi(user.id, {
          prefix: process.env.NEXT_PUBLIC_APP_URL!,
        })

        if (!uSettings) {
          redirect('/wizard')
        }

        dispatch(setUserSettings(uSettings))
      } catch (err: any) {
        console.log(err)
      }
    }
    getUserSettings()
  }, [dispatch, settings.userSettings.userId, user])

  return null
}

export default UseSettings
