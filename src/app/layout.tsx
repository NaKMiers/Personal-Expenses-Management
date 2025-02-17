import RootProviders from '@/components/providers/RootProviders'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.scss'

export const metadata: Metadata = {
  title: 'Personal Expenses Management',
  description: 'Personal Expenses Management Web Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="text-light bg-neutral-900"
      >
        <body>
          <Toaster position="bottom-left" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
