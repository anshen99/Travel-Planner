import './globals.css'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Travel Planner',
  description: 'Plan your next adventure with ease',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className=" pt-12">
        <AuthProvider>
          <Navbar />
          <main className="h-full">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 