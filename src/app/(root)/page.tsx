import HomeCard from "@/components/cards/HomeCard";
import { getServerSession } from "next-auth";
import { authOption } from "../(next-auth)/api/auth/[...nextauth]/route";


export default function Home() {

    return (
        <section>
            <HomeCard />
        </section>
    );
}