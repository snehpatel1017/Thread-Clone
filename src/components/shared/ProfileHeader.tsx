'use client';

import { addFollower } from "@/actions/Users";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";

interface Props {
    imageUrl: string,
    username: string,
    name: string,
    bio: string,
    follow: boolean,
    userID: string
}

export default function ProfileHeader({ imageUrl, username, name, bio, follow, userID }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const { data, status } = useSession();
    const [text, setText] = useState(follow ? "Follow" : "Following")
    if (status === 'authenticated' && data.user.thread_username == null) router.push("/onboarding")

    async function handlefollowing() {
        setText("requested")
        const result = await addFollower(userID, data?.user.id, pathname)
        if (result) {
            follow = false
            setText("Following")
        }
    }
    return (

        <div className="flex flex-col justify-start">
            <div className="flex justify-between ">
                <div className="flex items-center gap-3">
                    <div className="">
                        <img src={imageUrl} className="rounded-full w-20 h-20"></img>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-heading3-bold">{name}</h3>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                        <button onClick={handlefollowing} className={`mt-3 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm w-full sm:w-auto px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${follow ? "bg-sky-800  hover:bg-sky-500" : "bg-sky-500"}`} disabled={!follow}>{text}
                        </button>
                    </div>
                </div>
            </div>
            <p className="mt-3 text-light-2 text-base-regular">{bio}</p>
            <div className="h-0.5 bg-dark-2 w-full mt-6" ></div>
        </div>
    );
}