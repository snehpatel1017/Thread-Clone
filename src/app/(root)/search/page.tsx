"use client";

import client from "@/Prisma_client/prisma_client";
import UserCard from "@/components/cards/UserCard";
import { useEffect, useRef, useState } from "react";
import { fecthUsers } from "@/actions/Users";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface User {
    id: string,
    name: string,
    thread_username: string,
    thread_image: string,
}

export default function Search() {
    const router = useRouter();
    const { data, status } = useSession();
    if (status === 'authenticated' && data.user.thread_username == null) router.push("/onboarding")
    const [input, setInput] = useState("");
    const [result, setResult] = useState([]);

    async function handleSearch() {
        console.log(input)
        const searchString = input;
        const items = await fecthUsers({ searchString: searchString, sortBy: 'asc' });
        setResult([...items])
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            handleSearch();
        }, 400)
        return () => clearTimeout(timeout);
    }, [input])

    return (

        <section>

            <div className="relative mb-10 text-light-2">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </div>
                <input onChange={(e) => { setInput(e.target.value) }} type="text" id="default-search" className="  block w-full p-2 pl-10 text-sm text-light-2  rounded-lg bg-dark-2 border-dark-2 focus:outline-none" placeholder="Enter the username..." required />
                <button onClick={handleSearch} className="text-white absolute right-2.5 bottom-2.5  font-medium rounded-lg text-sm px-4 "><img src="/assets/search.svg"></img></button>
            </div>

            <div className=" text-light-1 gap-10 flex flex-col">
                {result.map((user: User, index) => {
                    return <UserCard key={index} userID={user.id} name={user.name} username={user.thread_username} imageUrl={user.thread_image} />
                })}
            </div>
        </section >
    );
}
