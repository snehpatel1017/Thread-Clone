"use client";
import CreateThread from '@/components/forms/CreatThread';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
export default function Home() {
    const router = useRouter();
    const { data, status } = useSession();
    if (status === 'authenticated' && data.user.thread_username == null) router.push("/onboarding")

    if (status !== 'authenticated') {
        router.push("/sign-in")
    }
    else {
        return (

            <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 ">
                <h1 className='text-heading2-bold text-light-1'>Make Thread</h1>
                <section className='mt-9 bg-dark-2 '>
                    <CreateThread />
                </section>
            </main>
        )
    }
}
