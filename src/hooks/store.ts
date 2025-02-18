import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from '@/reducers/settingsReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
