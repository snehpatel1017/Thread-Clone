"use client";

import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useId } from "react";

interface params {
    userID: any,
    name: string | null,
    username: string | null,
    imageUrl: string,
    isright: boolean | null,
}

export default function UserCard({ userID, name, username, imageUrl, isright = false }: params) {
    const route = useRouter();
    return (
        <article className="flex justify-start gap-4">
            <div>
                <img src={imageUrl} className={`${isright ? "w-24 h-12" : "w-20 h-16"} object-cover rounded-full`}></img>
            </div>
            <div className="flex flex-col w-full">
                <h3>{name}</h3>
                <p>@{username}</p>
            </div>
            <Button className={`bg-purple-500 ${isright ? "h-8" : "h-10"} hover:bg-purple-400`} onClick={() => { route.push(`/profile/${userID}`) }} >View</Button>
        </article>
    );
}