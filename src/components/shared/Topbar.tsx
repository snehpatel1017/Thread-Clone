import Link from "next/link";
import Image from "next/image"
import { getServerSession } from "next-auth"
import { authOption } from "../../app/(next-auth)/api/auth/[...nextauth]/route"

export default async function Topbar() {
    const session = await getServerSession(authOption);
    return (
        <nav className="fixed top-0 z-30 flex w-full items-center justify-between bg-dark-2 px-6 py-3">
            <Link className="flex items-center gap-4" href="/">
                <Image src="/assets/logo.svg" width={28} height={28} alt="logo"></Image>
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
            </Link>
            <div className="flex items-center gap-1">
                <div className="block md:hidden">
                    {session != null ? <div className="py-2 flex cursor-pointer"><Image src="/assets/logout.svg" alt="logout" width={24} height={24}></Image></div> : null}
                </div>
            </div>
        </nav>
    );
}