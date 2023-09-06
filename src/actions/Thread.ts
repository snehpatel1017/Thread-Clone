"use server";
import client from "@/Prisma_client/prisma_client"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route"
import z from "zod";
import { communityTabs } from "@/constants";
import { Session } from "inspector";
import { throws } from "assert";
import { Prisma } from "@prisma/client";
interface params {
    communityId: string | null,
    path: string
}
const comment = z.object({
    'text': z.string().min(1, { message: "You can not enter the empty comment" }),
    'threadId': z.string(),
    'path': z.string(),

})
interface User {
    id: string,
    name: string,
    thread_bio: string,
    thread_image: string,
    thread_username: string,
}

type comment = z.infer<typeof comment>;

export async function makeThread(data: params, body: any): Promise<void> {
    var session = await getServerSession(authOption);
    //@ts-ignore
    const user: User = session?.user
    const schema = z.object({
        communityId: z.string().nullable(),
        path: z.string(),
    })

    data = schema.parse(data)
    const thread = await client.thread.create({
        data: {
            body: body,
            author: user.id,
        }
    })
    revalidatePath(data.path)
}

export async function fetchThread(): Promise<Prisma.JsonValue> {
    const result = await client.thread.findMany();
    return result[0].body
}

export async function addingComment(formdata: comment): Promise<void> {
    var session = await getServerSession(authOption);
    //@ts-ignore
    const user: User = session?.user
    const fdata = comment.safeParse(formdata)
    if (!fdata.success) {
        console.log(fdata.error.flatten().fieldErrors)

    }
    else {

        formdata = fdata.data
        const data = await client.thread.create({
            data: {
                body: {
                    text: formdata['text'],
                },
                author: user.id,
                parentId: formdata['threadId'],
            }
        })
    }
    revalidatePath(formdata['path'])

}


export async function deleteThread({ threadId, path }: { threadId: string, path: string }): Promise<void> {

    const data = await client.thread.delete({
        where: {
            id: threadId
        }
    })
    revalidatePath(path)
}

export async function fetchThreads(skip: any): Promise<object> {
    const session = await getServerSession(authOption);
    const follows = await client.follows.findMany({
        where: {
            user2: session?.user.id,
            OR: [
                { status: "approved" },
                { status: "following" },
            ]
        }
        ,
        select: {
            user1: true,
        }
    })
    follows.push({ user1: session!.user.id })
    const data = await client.thread.findMany({
        where: {
            parentId: null,
            author: {
                in: follows.map(user => user.user1)
            }
        },
        orderBy: [{
            createdAt: "desc"
        }],
        include: {
            user: true,
        },
        skip: skip * 3,
        take: 3,
    });
    return data
}