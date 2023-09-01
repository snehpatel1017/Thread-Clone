'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function LogOut() {
    const { data, status } = useSession();
    const router = useRouter();
    if (status !== 'authenticated') router.push("/sign-in")


    return (
        <>

            <div className="flex mt-40 flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-semibold">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-40 w-auto rounded-2xl"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgf0oMencrweFeMhBiRwvo_v0yJ3kqna-WjtFbpZfnM1_ISr3t0funGHL3yVangW318h8&usqp=CAU"
                        alt="Your Company"
                    />

                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <button
                        onClick={() => { signOut(); router.push("/sign-in") }}
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        LogOut
                    </button>

                </div>
            </div>
        </>
    )
}
