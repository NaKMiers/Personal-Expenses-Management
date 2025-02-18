import RootProviders from '@/components/providers/RootProviders'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.scss'

export const metadata: Metadata = {
  title: 'PEM ',
  description: 'Personal Expenses Management Web Application',
  keywords: 'pem',
  icons: {
    icon: ['/favicon.ico?v=4'],
    apple: ['/apple-touch-icon.png?v=4'],
    shortcut: ['/apple-touch-icon.png'],
  },
  manifest: '/site.webmanifest',
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
        className="bg-neutral-900 text-light"
      >
        <body>
          <Toaster position="bottom-left" />
          <RootProviders>{children}</RootProviders>
        </body>
      </html>
    </ClerkProvider>
  )
}
