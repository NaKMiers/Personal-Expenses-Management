import { IUserSettings } from '@/models/UserSettingsModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const settings = createSlice({
  name: 'settings',
  initialState: {
    userSettings: {
      userId: '',
      currency: 'USD',
    } as IUserSettings,
    exchangeRates: null as any,
    exchangeRate: 0,
  },
  reducers: {
    setUserSettings: (state, action: PayloadAction<any>) => {
      state.userSettings = action.payload
    },
    setExchangeRates: (state, action: PayloadAction<any>) => {
      state.exchangeRates = action.payload
    },
    setExchangeRate: (state, action: PayloadAction<number>) => {
      state.exchangeRate = action.payload
    },
  },
})

export const { setUserSettings, setExchangeRates, setExchangeRate } = settings.actions
export default settings.reducer
