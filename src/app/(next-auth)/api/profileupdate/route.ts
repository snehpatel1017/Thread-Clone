import { log } from "console";
import { request } from "http"
import client from "@/Prisma_client/prisma_client";
import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/route";
import { Prisma } from "@prisma/client";



export async function POST(request: Request) {
    try {

        const data = await request.json();
        const sessiondata = await getServerSession(authOption)
        if (data.username.length == 0) {

            throw new Error("User name must not be Empty!")
        }
        if (/^[A-Za-z0-9]*$/.test(data.username) == false) {
            throw new Error("User name only contain numbers and characters!");
        }

        const db_res = await client.user.update({
            data: {
                thread_bio: data.userbio,
                thread_image: data.userimage,
                thread_username: data.username,
            },
            where: {
                id: sessiondata?.user.id
            }
        })

    }
    catch (error) {
        //@ts-ignore
        return new Response(error.message, { status: 400 })
    }
    return new Response("Succesfully Profile Updated", { status: 200 });
}