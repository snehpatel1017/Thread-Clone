'use client'
import { useSession } from "next-auth/react"
import { authOption } from "../../app/(next-auth)/api/auth/[...nextauth]/route"
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "../../constants/index";
import { signOut, signIn } from "next-auth/react";
export default function LeftSidebar() {
    const { data: session, status } = useSession();
    return (
        <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-auto border-r border-r-dark-4 bg-dark-2 pb-5 pt-28 max-md:hidden">
            <div className="flex flex-1 flex-col w-full gap-6 px-6">
                {sidebarLinks.map((link) => {
                    return (
                        <Link href={link.route} key={link.label} className="relative flex justify-start gap-4 rounded-lg ">
                            <Image src={link.imgURL} alt={link.label} width={24} height={24}></Image>
                            <p className="text-light-1 max-lg:hidden">{link.label}</p>
                        </Link>
                    )
                })}
            </div>
            <div className="mt-10 px-6">
                {status === 'authenticated' ? <button onClick={() => signOut()} className="gap-4 p-4 flex cursor-pointer"><Image src="/assets/logout.svg" alt="logout" width={24} height={24}></Image><p className="text-light-1">logout</p></button> : <button onClick={() => signIn('google')} className="gap-4 p-4 flex cursor-pointer"><Image src="/assets/sigin.svg" alt="sigin" width={24} height={24}></Image><p className="text-light-1">sigin</p></button>}
            </div>
        </section>
    );
}