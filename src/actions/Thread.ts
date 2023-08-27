"use server";
import client from "@/Prisma_client/prisma_client"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route"
import z from "zod";
import { communityTabs } from "@/constants";
import { Session } from "inspector";
import { throws } from "assert";
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

export async function makeThread(data: params, body: any) {
    const session = await getServerSession(authOption);
    const schema = z.object({
        communityId: z.string().nullable(),
        path: z.string(),
    })

    data = schema.parse(data)
    const thread = await client.thread.create({
        data: {
            body: body,
            author: session?.user.id,
            community: data.communityId,
        }
    })
    revalidatePath(data.path)
}

export async function fetchThread() {
    const result = await client.thread.findMany();
    return result[0].body
}

export async function addingComment(formdata: comment) {
    const session = await getServerSession(authOption);
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
                author: session?.user.id,
                parentId: formdata['threadId'],
            }
        })
    }
    revalidatePath(formdata['path'])

}


export async function deleteThread({ threadId, path }: { threadId: string, path: string }) {

    const data = await client.thread.delete({
        where: {
            id: threadId
        }
    })
    revalidatePath(path)
}