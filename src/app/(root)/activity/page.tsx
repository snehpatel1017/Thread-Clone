import client from "@/Prisma_client/prisma_client";
import { fetchFollowers, getActivity } from "@/actions/Users";
import { fetchFollowRequest } from "@/actions/Activity";
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import { ActivityCard } from "@/components/cards/ActivityCard";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";

import Link from "next/link";
interface User {
    thread_image: string,
    thread_username: string,
}
interface activity {
    id: string;
    body: Prisma.JsonValue;
    author: string;
    createdAt: Date | string;
    parentId: string | null;
    user: User
}

interface seconduser {
    thread_username: string | null;
    thread_image: string | null;
};

interface firstuser {
    thread_username: string | null;
    thread_image: string | null;
};
interface followrequest {
    id: string;
    user1: string;
    user2: string;
    status: string;
    createdAt: Date | string;
    seconduser: seconduser,
    firstuser: firstuser
}



export default async function Activity() {
    const session = await getServerSession(authOption);
    if (session == null) {
        return (
            <>
                <div className="flex flex-col justify-start gap-3 w-full">
                    <div className="flex justify-center">

                        <h1 className='text-heading2-bold text-light-1'>You need to login to see the activity page</h1>
                    </div>
                    <div className="flex justify-center">
                        <img src="https://previews.123rf.com/images/piren/piren1703/piren170301604/74998789-oops-on-a-black-background.jpg" className="h-60 w-60"></img>
                    </div>
                </div>

            </>
        );
    }
    else {
        const activity: Array<activity> = await getActivity();
        const followeRequest: Array<followrequest> = await fetchFollowRequest();

        return (

            <>
                <h1 className='text-heading2-bold text-light-1'>Activity</h1>

                <section className='mt-10 flex flex-col gap-5'>
                    {activity.length > 0 ? (
                        <>
                            {activity.map((activity, index) => (
                                <Link key={index} href={`/thread/${activity.parentId}`}>
                                    <article className='flex items-center gap-2 rounded-md bg-dark-2 px-7 py-4'>
                                        <img src={activity.user.thread_image} alt="user_image" className="object-cover w-10 h-10 rounded-full"></img>
                                        <p className='!text-small-regular text-light-1'>
                                            <span className='mr-1 text-primary-500'>
                                                {activity.user.thread_username}
                                            </span>{" "}
                                            replied to your thread
                                        </p>
                                    </article>
                                </Link>
                            ))}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No activity yet</p>
                    )}
                </section>
                <section className='mt-10 flex flex-col gap-5'>
                    {followeRequest?.length > 0 ? (
                        <>
                            {followeRequest.map((request, index) => {
                                if (request.status === "requested") {
                                    return <ActivityCard key={index} userID={request.user2} thread_image={request.seconduser.thread_image} thread_username={request.seconduser.thread_username} text="requested to follow You" type={1}></ActivityCard>;
                                }
                                else {
                                    return <ActivityCard key={index} userID={request.status === "approved" ? request.user2 : request.user1} thread_image={request.status === "approved" ? request.seconduser.thread_image : request.firstuser.thread_image} thread_username={request.status === "approved" ? request.seconduser.thread_username : request.firstuser.thread_username} text={request.status} type={request.status === "approved" ? 3 : 2}></ActivityCard>;
                                }
                            })}
                        </>
                    ) : (
                        <p className='!text-base-regular text-light-3'>No Follow Request</p>
                    )}
                </section>
            </>
        );
    }
}