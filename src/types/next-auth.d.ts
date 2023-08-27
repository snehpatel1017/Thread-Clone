import type { Session, User } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
declare module "next-auth/jwt" {
    interface JWT {
        id: string
    }
}

declare module "next-auth" {
    interface Session {
        user: User & {
            id: string,
            name: string,
            email: string,
            image: string,
            thread_username: string,
            thread_bio: string,
            thread_image: string,
        }
    }
}