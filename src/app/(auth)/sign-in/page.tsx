'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function LogIn() {
  const { data, status } = useSession();
  const router = useRouter();
  if (status === 'authenticated') router.push("/")

  async function handler(e) {
    e.preventDefault();
    signIn("credentials", { ...data, redirect: false }).then(() => alert('user foudn')).catch(() => alert("Wrong"))


  }
  return (
    <>

      <div className="flex mt-40 flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-semibold">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-20 w-auto"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Google_logo_%282013-2015%29.svg/750px-Google_logo_%282013-2015%29.svg.png"
            alt="Your Company"
          />

        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

          <button
            onClick={() => signIn('google')}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>

        </div>
      </div>
    </>
  )
}
