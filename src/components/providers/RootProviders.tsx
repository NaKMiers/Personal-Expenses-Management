'use client'

import { AppStore, makeStore } from '@/hooks/store'
import { ReactNode, useRef } from 'react'
import { Provider } from 'react-redux'

function RootProviders({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

export default RootProviders
