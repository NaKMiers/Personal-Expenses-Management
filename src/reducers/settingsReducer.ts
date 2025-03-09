import { IUserSettings } from '@/models/UserSettingsModel'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const settings = createSlice({
  name: 'settings',
  initialState: {
    userSettings: {
      userId: '',
      currency: 'USD',
    } as IUserSettings,
  },
  reducers: {
    setUserSettings: (state, action: PayloadAction<any>) => {
      state.userSettings = action.payload
    },
  },
})

export const { setUserSettings } = settings.actions
export default settings.reducer
