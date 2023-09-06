"use client";
import client from "@/Prisma_client/prisma_client";
import { fetchThreads } from "@/actions/Thread";
import ThreadCard from "@/components/cards/ThreadCard";
import EditorViewer from "@/components/shared/EditorViewer";
import { stat } from "fs";
import { useSession } from "next-auth/react";
import { revalidatePath } from "next/cache";
import { David_Libre } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Home() {

    var { data, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    if (status === 'authenticated' && data?.user.thread_username == null) router.push("/onboaring")

    const [skip, setSkip] = useState(0);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    // console.log(data)

    async function fetch() {
        const data_item = await fetchThreads(skip);
        //@ts-ignore
        setItems([...items, ...data_item]);
        //@ts-ignore
        if (data_item.length === 0) {
            setHasMore(false);
        }
        setSkip(skip + 1);
    }
    useEffect(() => {
        fetch();
    }, []);
    return (
        <main className="">


            <InfiniteScroll
                dataLength={items.length}
                next={fetch}
                hasMore={hasMore}
                loader={<svg className="animate-spin w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                </svg>}
                className="flex flex-col gap-10"
            >
                {items.map((d, index) => {
                    return (<>
                        <ThreadCard data={d} isComment={false} key={index} />
                    </ >
                    );
                })}
            </InfiniteScroll>

        </main>

    );
}