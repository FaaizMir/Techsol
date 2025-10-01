import type { Metadata } from 'next'
import ClientLayout from './client-layout'
import { ScrollSectionProvider } from '@/hooks/scroll-section-context'
import { Providers } from '@/components/providers/Providers'
import { AuthProvider } from '@/components/providers/AuthProvider'
import NextTopLoader from 'nextjs-toploader'
import './globals.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
        <NextTopLoader
          color="#3b82f6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        />
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
