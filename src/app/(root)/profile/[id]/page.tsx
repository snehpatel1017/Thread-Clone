import client from "@/Prisma_client/prisma_client";
import { checkFollowing } from "@/actions/Users";
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import ProfileBody from "@/components/shared/ProfileBody";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useState } from "react";

interface User {
    id: string,
    name: string,
    thread_bio: string,
    thread_image: string,
    thread_username: string,
}

export default async function Profile({ params }: { params: { id: string } }) {
    const session_data = await getServerSession(authOption)
    if (session_data == null) {
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
    var follow = true;
    if (session_data?.user.id == params.id) {
        follow = false;
    }
    else {
        follow = await checkFollowing(params.id, session_data?.user.id)
    }
    const user: User = await client.user.findUnique({
        where: {
            id: params.id,
        },
        select: {
            id: true,
            name: true,
            thread_bio: true,
            thread_image: true,
            thread_username: true,
        }
    })
    const threads = await client.thread.findMany({
        where: {
            author: params.id,
            parentId: null,
        },
        include: {
            user: true,
        }
    })
    return (
        <section className="text-light-1">
            <ProfileHeader imageUrl={user?.thread_image} username={user?.thread_username} name={user?.name} bio={user?.thread_bio} follow={follow} userID={user.id} />
            <ProfileBody threads={threads} isUser={session_data?.user.id == params.id ? true : false}></ProfileBody>
        </section>
    );
}