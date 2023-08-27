import Image from 'next/image'
import { getServerSession } from "next-auth";
import { authOption } from "../../(next-auth)/api/auth/[...nextauth]/route";
import { signOut } from "next-auth/react";
import AccountProfile from '@/components/forms/AccountProfile';

export default async function Home() {
  const data = await getServerSession(authOption);
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className='text-heading2-bold text-light-1'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use Threds.
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile />
      </section>
    </main>
  )
}
