import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: 'Feedback Log',
  description: 'create your own review',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
