import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import client from "../../../../../Prisma_client/prisma_client";

export const authOption: AuthOptions = {
    adapter: PrismaAdapter(client),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    secret: process.env.SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {

        async session({ token, session }) {

            if (token) {
                const user_data = await client.user.findUnique({ where: { id: token.sub } })
                session.user.id = user_data?.id!;
                session.user.email = user_data?.email!;
                session.user.image = user_data?.image!;
                session.user.name = user_data?.name!;
                session.user.thread_bio = user_data?.thread_bio!;
                session.user.thread_image = user_data?.thread_image!;
                session.user.thread_username = user_data?.thread_username!;
            }

            return session;
        },
    },
    // debug: true,

}

const handler = NextAuth(authOption);

export { handler as GET, handler as POST }