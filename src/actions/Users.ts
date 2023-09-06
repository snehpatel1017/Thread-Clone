"use server";

import client from "@/Prisma_client/prisma_client";
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { use } from "react";
import z, { ZodError } from "zod";

interface fetchUsers_params {
    searchString: string,
    sortBy: string,
}
interface User {
    id: string,
    name: string,
    thread_bio: string,
    thread_image: string,
    thread_username: string,
}

export async function fecthUsers(params: fetchUsers_params): Promise<Array<Prisma.JsonValue>> {
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

        return [{ num: -2 }];
    }
}
interface activity {
    id: string;
    body: Prisma.JsonValue;
    author: string;
    createdAt: Date | string;
    parentId: string | null;
    user: { thread_image: string, thread_username: string }
}

export async function getActivity(): Promise<Array<activity>> {
    try {
        var session = await getServerSession(authOption);

        const user: User = session!.user


        const data = await client.thread.findMany({
            where: {
                author: user.id,
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
        return [{ id: "23", body: "nothing", author: "nothing", createdAt: "nothing", parentId: null, user: { thread_image: "Sdf", thread_username: "sdf" } }]
    }
}



export async function fetchFollowers(): Promise<Array<object>> {
    const session = await getServerSession(authOption);
    if (session == null) return [];

    try {
        const data = await client.follows.findMany({
            where: {
                user1: session?.user.id,
                OR: [
                    { status: "following" },
                    { status: "approved" },
                ]
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
        return [{ num: -2 }]
    }
}

export async function fetchFollows() {
    const session = await getServerSession(authOption);
    if (session == null) return [];
    try {
        const data = await client.follows.findMany({
            where: {
                user2: session?.user.id,
                OR: [
                    { status: "following" },
                    { status: "approved" },
                ]
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


export async function checkFollowing(host: string, user: string): Promise<string | null> {
    try {

        const data = await client.follows.findFirst({
            where: {
                OR: [

                    { user1: user, user2: host }
                ]
            }
            ,
            select: {
                status: true,
            }
        })

        if (data != null) return data.status;
        return null;
    }
    catch (err: any) {
        console.log(err.message)
        console.log("error in checkFollowing")
        return null
    }
}

export async function addFollower(host: string, user: string, path: string): Promise<string | null> {
    try {
        var result = null;
        try {
            result = await client.follows.update({
                data: {
                    status: "following"
                },
                where: {
                    user1_user2: {
                        user1: host,
                        user2: user,

                    },
                },
                select: {
                    status: true,
                }
            })
        }
        catch (err: any) {
            console.log("not found so no update!!")
        }

        const temp = await client.follows.create({
            data: {
                status: result === null ? "requested" : "following",
                user1: user,
                user2: host,
            },
            select: {
                status: true,
            }
        })


        revalidatePath(path)
        return temp.status;
    }
    catch (err: any) {
        console.log(err.message)

        return null
    }
}


export async function unfollowUser(host: string, user: string, path: string): Promise<boolean> {
    try {

        try {
            var result = await client.follows.update({
                data: {
                    status: "requested"
                },
                where: {
                    user1_user2: {
                        user1: host,
                        user2: user,

                    },
                },
            })
        }
        catch (err: any) {
            console.log("not found in unfollowUser")

        }
        var temp = await client.follows.delete({
            where: {
                user1_user2: {
                    user1: user,
                    user2: host,
                }
            }
        })

        revalidatePath(path)
        return true;
    }
    catch (err: any) {
        console.log(err.message)
        return false
    }
}


