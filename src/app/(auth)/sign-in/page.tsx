'use client'
import { signIn } from "next-auth/react";

export default function signin() {
  return (
    <div>
      <h1>hello</h1>
      <button onClick={() => signIn("google", { callbackUrl: `${window.location.origin}/onboarding/` })}>sigin</button>
    </div>
  )
}