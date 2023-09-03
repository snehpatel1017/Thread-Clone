"use server";

import client from "@/Prisma_client/prisma_client";
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { use } from "react";
import z, { ZodError } from "zod";

interface fetchUsers_params {
    searchString: string,
    sortBy: string,
}

export async function fecthUsers(params: fetchUsers_params) {
    const schema = z.object({
        searchString: z.string().min(1, "the search filed should not be empty !"),
        sortBy: z.string(),
    })

    try {
        params = schema.parse(params);
        const result = await client.user.findMany({
            where: {
                thread_username: {
                    startsWith: params.searchString,
                }
            },
            select: {
                id: true,
                name: true,
                thread_username: true,
                thread_image: true,
            },

        })
        return result;
    }
    catch (err: any) {
        if (err instanceof ZodError) return -1;
        return -2;
    }
}


export async function getActivity() {
    try {
        const session = await getServerSession(authOption)
        const data = await client.thread.findMany({
            where: {
                author: session.user.id,
                parentId: null,
            },
            include: {
                children: {
                    include: {
                        user: {
                            select: {
                                thread_username: true,
                                thread_image: true,
                            }
                        }
                    }
                },
            },

        })
        var activity = [].concat(...data.map((item: any) => {
            return item.children;
        }))
        return activity

    }
    catch (err: any) {
        console.log("Error !!!")
    }
}



export async function fetchFollowers() {
    const session = await getServerSession(authOption);
    if (session == null) return [];

    try {
        const data = await client.follows.findMany({
            where: {
                user1: session?.user.id,
            },
            include: {
                seconduser: {
                    select: {
                        name: true,
                        thread_username: true,
                        thread_image: true,
                    }
                }
            }
        })
        return data;
    }
    catch (err) {

    }
}

export async function fetchFollows() {
    const session = await getServerSession(authOption);
    if (session == null) return [];
    try {
        const data = await client.follows.findMany({
            where: {
                user2: session?.user.id,
            },
            include: {
                firstuser: {
                    select: {
                        name: true,
                        thread_username: true,
                        thread_image: true,
                    }
                }
            }
        })
        return data;
    }
    catch (err) {

    }
}


export async function checkFollowing(u1: string, u2: string): Promise<boolean> {
    try {

        const data = await client.follows.findMany({
            where: {
                user1: u1,
                user2: u2,
            }
        })
        if (data.length == 0) return true;
        return false;
    }
    catch (err: any) {
        console.log(err.message)
        console.log("error in checkFollowing")
        return true
    }
}

export async function addFollower(u1: string, u2: string, path: string): Promise<boolean> {
    try {


        const result = await client.follows.create({
            data: {
                user1: u1,
                user2: u2,
            }
        })


        revalidatePath(path)
        return true
    }
    catch (err: any) {
        console.log(err.message)
        console.log("oyyyyyyyy")
        return false
    }
}