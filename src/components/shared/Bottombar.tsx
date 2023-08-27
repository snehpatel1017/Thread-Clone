import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "../../constants/index";

export default function Bottombar() {
    return (
        <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bg-glassmorphism p-4 backdrop-blur-lg xs:px-7 md:hidden">
            <div className="flex items-center justify-between gap-3 xs:gap-5;">
                {sidebarLinks.map((link) => {
                    return (
                        <Link href={link.route} key={link.label} className="relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5">
                            <Image src={link.imgURL} alt={link.label} width={24} height={24}></Image>

                        </Link>
                    )
                })}
            </div>
        </section>
    );
}