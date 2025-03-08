'use client'

import { AppStore, makeStore } from '@/hooks/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ReactNode, useRef, useState } from 'react'
import { Provider } from 'react-redux'

function RootProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const storeRef = useRef<AppStore>(null)

  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}

export default RootProviders
