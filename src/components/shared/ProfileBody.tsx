"use client";
import Link from "next/link";
import { useState } from "react";
import ThreadCard from "../cards/ThreadCard";
import { GetResult } from "@prisma/client/runtime";
import { Prisma } from "@prisma/client";

interface Props {
    threads: Array<Prisma.JsonValue>,
    replies: Array<Prisma.JsonValue>,
    isUser: Boolean,
    follow: string | null,
}

export default function ProfileBody({ threads, replies, isUser, follow }: Props) {

    const [tab, setTab] = useState("Threads")
    return (
        <div className="flex flex-col">
            <div className="rounded-2xl mt-6 border-dark-3 bg-dark-3">

                <ul className=" p-1 flex items-center text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-2xl shadow sm:flex dark:divide-gray-700 dark:text-gray-400 ">
                    <Link onClick={() => { setTab("Threads") }} className={`inline-block w-full p-2 bg-dark-3 hover:text-light-2 hover:bg-dark-2 ${tab == 'Threads' ? "text-light-2 bg-dark-2" : ""}`} href={"#"}>
                        Threads
                    </Link>
                    <Link onClick={() => { setTab("Replies") }} className={`inline-block w-full p-2 bg-dark-3 hover:text-light-2   hover:bg-dark-2  ${tab == 'Replies' ? "text-light-2 bg-dark-2" : ""}`} href={"#"}>
                        Replies
                    </Link>
                    <Link onClick={() => { setTab("Tagged") }} className={`inline-block w-full p-2 bg-dark-3 hover:text-light-2   hover:bg-dark-2   ${tab == 'Tagged' ? "text-light-2 bg-dark-2" : ""}`} href={"#"}>
                        Tagged
                    </Link>
                </ul>

            </div>

            <div className="mt-5 flex flex-col justify-start gap-5">

                {
                    follow === null ? null : follow !== "requested" ? (tab == "Threads" ?

                        threads.map((thread, index) => {
                            return <ThreadCard key={index} data={thread} isUser={isUser}></ThreadCard>
                        })
                        : tab == "Replies" ? replies.map((thread, index) => {
                            return <ThreadCard key={index} data={thread} isUser={isUser}></ThreadCard>
                        }) : threads.map((thread, index) => {
                            return <ThreadCard key={index} data={thread} isUser={isUser}></ThreadCard>
                        })) :
                        (null)
                }
            </div>

        </div>
    );
}