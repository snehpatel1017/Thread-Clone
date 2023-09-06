'use client';

import { addFollower, unfollowUser } from "@/actions/Users";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";

interface Props {
    imageUrl: string,
    username: string,
    name: string,
    bio: string,
    follow: string | null,
    userID: string
}

interface User {
    id: string,
    name: string,
    thread_bio: string,
    thread_image: string,
    thread_username: string,
}


export default function ProfileHeader({ imageUrl, username, name, bio, follow, userID }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    const { data, status } = useSession();
    //@ts-ignore
    const user: User = data?.user
    const [text, setText] = useState(follow === null ? "Follow" : follow === "requested" ? "requested" : "Unfollow")
    if (status === 'authenticated' && data.user.thread_username == null) router.push("/onboarding")

    async function handlefollowing() {
        if (text == "Follow") {
            setText("requested")
            const result = await addFollower(user.id, userID, pathname)
            if (result !== null) {
                follow = result;
                setText(follow === "requested" ? "requested" : "Unfollow")
            }
        }
        else {
            const result = await unfollowUser(user.id, userID, pathname)
            if (result) {
                follow = null
                setText("Follow")
            }
        }
    }

    return (

        <div className="flex flex-col justify-start">
            <div className="flex justify-between ">
                <div className="flex items-center gap-3">
                    <div className="">
                        <img src={imageUrl} className="rounded-full w-20 h-20"></img>
                    </div>
                    <div className="flex-1 ">
                        <h3 className="text-heading3-bold">{name}</h3>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                        {userID !== data?.user.id ?
                            (<button onClick={handlefollowing} className={`mt-3 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm w-full sm:w-auto px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${follow === null ? "bg-sky-800  hover:bg-sky-500" : "bg-sky-500"}`} >{text}
                            </button>) :
                            (null)
                        }
                        {
                            userID === data?.user.id ? (<button onClick={() => { router.push("/onboarding") }} className="ml-2 mt-3 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm w-full sm:w-auto px-3 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 bg-sky-800  hover:bg-sky-500">Edit
                            </button>) : null

                        }

                    </div>
                </div>
            </div>
            <p className="mt-3 text-light-2 text-base-regular">{bio}</p>
            <div className="h-0.5 bg-dark-2 w-full mt-6" ></div>
        </div>
    );
}