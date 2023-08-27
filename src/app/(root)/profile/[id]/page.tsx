import client from "@/Prisma_client/prisma_client";
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
    const session_data = await getServerSession(authOption)
    return (
        <section className="text-light-1">
            <ProfileHeader imageUrl={user?.thread_image} username={user?.thread_username} name={user?.name} bio={user?.thread_bio} />
            <ProfileBody threads={threads} isUser={session_data?.user.id == params.id ? true : false}></ProfileBody>
        </section>
    );
}