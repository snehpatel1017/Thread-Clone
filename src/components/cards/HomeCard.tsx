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
import { Suspense, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/image";

export default function HomeCard() {

    var { data, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    if (status !== 'authenticated') router.push("/sign-in")
    if (status === 'authenticated' && data?.user.thread_username == null) router.push("/onboarding")

    const [skip, setSkip] = useState(0);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);


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
                loader={<div className="flex gap-2 no-scrollbar justify-center">
                    <Image src='/assets/loader-2.svg' alt='Loading...'
                        width={24}
                        height={24}
                        className='cursor-pointer object-contain animate-spin'
                    /><p className="text-light-3 text-body-bold">Loading....</p>
                </div>
                }
                className="flex flex-col gap-10 no-scrollbar"
            >
                {items.map((d, index) => {
                    return (
                        <ThreadCard data={d} isComment={false} key={index} />
                    );
                })}
            </InfiniteScroll>


        </main>

    );
}