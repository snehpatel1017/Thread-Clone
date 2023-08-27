import client from "@/Prisma_client/prisma_client";
import ThreadCard from "@/components/cards/ThreadCard";
import EditorViewer from "@/components/shared/EditorViewer";

export default async function Home() {
    const data = await client.thread.findMany({
        where: {
            parentId: null
        },
        orderBy: [{
            createdAt: "desc"
        }],
        include: {
            user: true,
        }
    });

    // console.log(data)
    return (
        <main className="">

            <div className="flex flex-col gap-10">
                {data.map((d) => {
                    return (<>
                        <ThreadCard data={d} isComment={false} />
                    </ >
                    );
                })}
            </div>


        </main>

    );
}