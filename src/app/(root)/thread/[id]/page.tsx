import client from "@/Prisma_client/prisma_client";
import ThreadCard from "@/components/cards/ThreadCard";
import { getServerSession } from "next-auth"
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import Comments from "@/components/forms/Comments";


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
                {data.children.map((childItem: any) => (
                    <ThreadCard
                        data={childItem}
                        isComment={true}
                    />
                ))}
            </div>
        </section>
    );
}