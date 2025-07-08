import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SellChillies - Business Management System',
  description: 'Comprehensive chillies trading and loan management system',
  keywords: 'chillies, trading, loan management, business, agriculture',
  authors: [{ name: 'SellChillies Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
