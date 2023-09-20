import client from "@/Prisma_client/prisma_client";
import ThreadCard from "@/components/cards/ThreadCard";
import { getServerSession } from "next-auth"
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import Comments from "@/components/forms/Comments";
import { checkFollowing } from "@/actions/Users";


export default async function Thread({ params }: { params: { id: string } }) {
    const session_data = await getServerSession(authOption)
    if (!session_data) return null;
    const data = await client.thread.findUnique({
        where: {
            id: params.id,
        },
        include: {
            children: {
                include: {
                    user: true,
                    children: true,
                }
            },
            user: true,

        }
    })
    var follow = null;
    if (data?.author !== session_data.user.id) {
        //@ts-ignore
        follow = await checkFollowing(session_data?.user.id, data?.author)
    }
    else {
        follow = data?.author
    }

    if (follow === null) {
        return (
            <>
                <div className="flex flex-col justify-start gap-3 w-full">
                    <div className="flex justify-center">

                        <h1 className='text-heading2-bold text-light-1'>You need to follow this thread's author to see this page</h1>
                    </div>
                    <div className="flex justify-center">
                        <img src="https://previews.123rf.com/images/piren/piren1703/piren170301604/74998789-oops-on-a-black-background.jpg" className="h-60 w-60"></img>
                    </div>
                </div>

            </>
        );
    }
    else {
        return (
            <section className='relative'>
                <div>
                    <ThreadCard
                        data={data}
                        isComment={false}
                    />
                </div>

                <div className='mt-7'>
                    {session_data != null ? <Comments data={session_data} threadId={data?.id} /> : null}
                </div>

                <div className='mt-10'>
                    {data?.children.map((childItem: any, index) => (
                        <ThreadCard
                            key={index}
                            data={childItem}
                            isComment={true}
                        />
                    ))}
                </div>
            </section>
        );

    }


}