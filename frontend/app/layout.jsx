import "./globals.css"
import { Sidebar } from "@/components/sidebar"

export const metadata = {
  title: "CalSlot",
  description: "A simple scheduling platform",
    generator: 'v0.app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
