import Topbar from '@/components/shared/Topbar'
import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import LeftSidebar from '@/components/shared/LeftSidebar'
import RightSidebar from '@/components/shared/RightSidebar'
import Bottombar from '@/components/shared/Bottombar'
import { getServerSession } from "next-auth";
import { authOption } from '../(next-auth)/api/auth/[...nextauth]/route'
import Provider from '../providers/sessionprovider'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads',
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

      <body className={inter.className}>
        <Topbar />
        <main className='flex flex-row'>
          <Provider session={session}>
            <LeftSidebar />
          </Provider>
          <section className='flex min-h-screen flex-1 flex-col items-center bg-dark-1 px-6 pb-10 pt-28 max-md:pb-32 sm:px-10'>
            <div className='w-full max-w-4xl'>
              <Provider session={session}>
                {children}
              </Provider>
            </div>
          </section>
          <RightSidebar />
        </main>
        <Bottombar />
      </body>
    </html>
  )
}
