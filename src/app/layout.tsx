import type { Metadata } from 'next'
import ClientLayout from './client-layout'
import { ScrollSectionProvider } from '@/hooks/scroll-section-context'
import { Providers } from '@/components/providers/Providers'
import { AuthProvider } from '@/components/providers/AuthProvider'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        <Providers>
          <AuthProvider>
            <ScrollSectionProvider>
              {/* <GoogleProvider> */}
                <ClientLayout>{children}</ClientLayout>
              {/* </GoogleProvider> */}
            </ScrollSectionProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
