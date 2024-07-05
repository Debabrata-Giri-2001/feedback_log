import './globals.css'

export const metadata = {
  title: 'Feedback Log',
  description: 'create your own review',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
