import type { Metadata } from 'next'
import ClientLayout from './client-layout'
import { ScrollSectionProvider } from '../hooks/scroll-section-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tech Solutions',
  description: 'Innovative technology solutions for modern businesses',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ScrollSectionProvider>
      <ClientLayout>{children}</ClientLayout>
    </ScrollSectionProvider>
  )
}
