"use client";
import { allowUser, notAllowUser } from "@/actions/Activity";
import { Button } from "flowbite-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react";

interface Props {
    userID: string,
    thread_image: string,
    thread_username: string,
    text: string,
    type: boolean,
}

export function ActivityCard({ userID, thread_image, thread_username, text, type }: any) {
    const route = useRouter();
    const pathname = usePathname();
    const [Type, setType] = useState(type)
    async function handleAllow() {
        const result = allowUser(userID, pathname);
        setType(3)
    }
    async function handleNotallow() {
        const result = notAllowUser(userID, pathname);
        setType(1);

    }
    return ((<>
        <article className='flex items-center gap-2 rounded-md bg-dark-2 px-7 py-4'>
            <img src={thread_image} alt="user_image" className="object-cover w-10 h-10 rounded-full"></img>
            <p className='!text-small-regular text-light-1 w-full'>
                <span className='mr-1 text-primary-500'>
                    {thread_username}
                </span>{" "}
                {text}
            </p>
            {
                Type === 1 ?
                    (<Button className="bg-purple-500 h-8 hover:bg-purple-400" onClick={handleAllow} >Allow</Button>)
                    :
                    Type == 2 ? (<Button className="bg-purple-500 h-8 hover:bg-purple-400" onClick={() => { route.push(`/profile/${userID}`) }} >View</Button>)

                        : (<Button className="bg-purple-500 h-8 hover:bg-purple-400" onClick={handleNotallow}>NotAllow</Button>)
            }

        </article>
    </>
    ))
}