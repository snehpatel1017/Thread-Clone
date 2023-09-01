import client from "@/Prisma_client/prisma_client";
import { getActivity } from "@/actions/Users";
import Link from "next/link";

export default async function Activity() {
    const activity = await getActivity();

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
        </>
    );
}