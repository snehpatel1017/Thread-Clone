"use server"
import { Prisma } from "@prisma/client";
import client from "@/Prisma_client/prisma_client";
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface seconduser {
    thread_username: string | null;
    thread_image: string | null;
};

interface firstuser {
    thread_username: string | null;
    thread_image: string | null;
};
interface followrequest {
    id: string;
    user1: string;
    user2: string;
    status: string;
    createdAt: Date | string;
    seconduser: seconduser,
    firstuser: firstuser
}
interface User {
    id: string,
    name: string,
    thread_bio: string,
    thread_image: string,
    thread_username: string,
}

export async function fetchFollowRequest(): Promise<Array<followrequest>> {
    try {
        const session = await getServerSession(authOption);
        //@ts-ignore
        var user: User = session?.user;
        const result = await client.follows.findMany({
            where: {
                OR: [
                    {
                        user1: user.id,
                        status: "requested",
                    },
                    {
                        user1: user.id,
                        status: "approved",
                    }
                ]
            },
            include: {
                seconduser: {
                    select: {
                        thread_username: true,
                        thread_image: true,
                    }
                },
                firstuser: {
                    select: {
                        thread_username: true,
                        thread_image: true,
                    }
                }
            },
            orderBy: [{
                createdAt: "desc"
            }],

        })

        return result;
    }
    catch (err: any) {
        console.log(err.message)
        return [{
            id: "nothing",
            user1: "nothing",
            user2: "string",
            status: "string",
            createdAt: "string",
            seconduser: { thread_image: "nothing", thread_username: "nothing" },
            firstuser: { thread_image: "nothing", thread_username: "nothing" },
        }]
    }
}

export async function allowUser(user: string, path: string): Promise<boolean> {
    const session = await getServerSession(authOption);
    //@ts-ignore
    var host: string = session?.user.id;
    try {
        const result = await client.follows.update({
            data: {
                status: "approved",
            },
            where: {
                user1_user2: {
                    user1: host,
                    user2: user,
                }
            }
        })

    }
    catch (err: any) {
        console.log(err.message)
    }
    revalidatePath(path);
    return true
}

export async function notAllowUser(user: string, path: string) {
    const session = await getServerSession(authOption);
    //@ts-ignore
    var host: string = session?.user.id;
    try {
        const result = await client.follows.update({
            data: {
                status: "requested",
            },
            where: {
                user1_user2: {
                    user1: host,
                    user2: user,
                }
            }
        })

    }
    catch (err: any) {
        console.log(err.message)
    }
    revalidatePath(path);
    return true
}

