"use client";
import Link from "next/link";
import { useState } from "react";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    threads: Array<JSON>,
    isUser: Boolean,
}

export default function ProfileBody({ threads, isUser }: Props) {
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
                    tab == "Threads" ?

                        threads.map((thread) => {
                            return <ThreadCard data={thread} isUser={isUser}></ThreadCard>
                        })
                        : tab == "Replies" ? threads.map((thread) => {
                            return <ThreadCard data={thread} isUser={isUser}></ThreadCard>
                        }) : threads.map((thread) => {
                            return <ThreadCard data={thread} isUser={isUser}></ThreadCard>
                        })
                }
            </div>

        </div>
    );
}