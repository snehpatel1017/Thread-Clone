"use client";
import Link from "next/link";
import Image from "next/image";
import EditorViewer from "../shared/EditorViewer";
import { usePathname } from "next/navigation";
import { deleteThread } from "@/actions/Thread";

export default function ThreadCard({ data, isComment = false, isUser }: any) {
    const pathname = usePathname();
    async function threadDelete() {
        const params = {
            threadId: data.id,
            path: pathname,
        }

        await deleteThread(params);

    }
    return (
        <article className={`flex w-full flex-col rounded-xl ${isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"} text-light-1`}>
            <div className='flex items-start justify-between'>
                <div className='flex w-full flex-1 flex-row gap-4'>
                    <div className='flex flex-col items-center'>
                        <Link href={`/profile/${data.user.id}`} className='relative h-11 w-11'>
                            <img
                                src={data.user.thread_image == null ? data.user.image : data.user.thread_image}
                                alt='user_community_image'
                                className='cursor-pointer rounded-full object-cover w-10 h-10'
                            />
                        </Link>
                        <div className='relative mt-2 w-0.5 grow rounded-full bg-neutral-800' />
                    </div>
                    <div className="flex flex-col w-full">
                        <Link href={`/profile/${data.user.id}`} className='w-fit'>
                            <h4 className='cursor-pointer text-base-semibold text-light-1'>
                                {data.user.name}
                            </h4>
                        </Link>

                        {data.parentId == null ? <EditorViewer data={data.body} ></EditorViewer> : <div className=" font-serif pt-3 relative w-full flex flex-col justify-center">
                            {data.body.text}
                        </div>}
                        <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
                            <div className='flex gap-3.5'>
                                <Image
                                    src='/assets/heart-gray.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Link href={`/thread/${data.id}`}>
                                    <Image
                                        src='/assets/reply.svg'
                                        alt='heart'
                                        width={24}
                                        height={24}
                                        className='cursor-pointer object-contain'
                                    />
                                </Link>
                                <Image
                                    src='/assets/repost.svg'
                                    alt='heart'
                                    width={24}
                                    height={24}
                                    className='cursor-pointer object-contain'
                                />
                                <Image src='/assets/share.svg' alt='heart' width={24} height={24}
                                    className='cursor-pointer object-contain'
                                />
                            </div>
                        </div>
                    </div>
                    <div>

                        {
                            isUser == true ? (
                                <button onClick={threadDelete}>
                                    <Image src='/assets/delete.svg' alt='Delete Thread' width={24} height={24}></Image>
                                </button>
                            ) : (
                                null
                            )
                        }
                    </div>

                </div>
            </div>

        </article>
    );
}