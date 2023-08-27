import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth";
import { authOption } from '../(next-auth)/api/auth/[...nextauth]/route'
import Provider from '../providers/sessionprovider'
import { json } from 'stream/consumers';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Thread',
  description: 'This is my thread clone',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOption)
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-1 text-light-1`} >

        <Provider session={session}>
          {children}
        </Provider>
      </body>
    </html >
  )
}
