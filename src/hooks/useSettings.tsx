'use client'

import { setExchangeRate, setExchangeRates, setUserSettings } from '@/reducers/settingsReducer'
import { getUserSettingsApi } from '@/requests'
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
        const { userSettings: uSettings } = await getUserSettingsApi(
          user.id,
          process.env.NEXT_PUBLIC_APP_URL,
          { next: { revalidate: 10 } }
        )

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

  useEffect(() => {
    const getExchangeRates = async () => {
      if (!settings.userSettings.currency) return

      try {
        // get exchange rate for user's currency in real-time
        const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
          next: { revalidate: 10 },
        })
        const data = await res.json()

        console.log('exchange rates', data.rates)

        dispatch(setExchangeRates(data.rates))
        dispatch(setExchangeRate(data.rates[settings.userSettings.currency]))
      } catch (err: any) {
        console.log(err)
      }
    }
    getExchangeRates()
  }, [dispatch, settings.userSettings])

  return null
}

export default UseSettings
