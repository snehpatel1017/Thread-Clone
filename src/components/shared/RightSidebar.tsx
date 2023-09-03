import { fetchFollowers, fetchFollows } from "@/actions/Users";
import { authOption } from "@/app/(next-auth)/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import UserCard from "../cards/UserCard";



interface Follower {
    id: string,
    user1: string,
    user2: string,
    seconduser: object
}
interface Follows {
    id: string,
    user1: string,
    user2: string,
    firstuser: object
}

export default async function RightSidebar() {
    const session = getServerSession(authOption)
    if (session == null) {
        return (
            <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-12 overflow-auto border-l border-l-dark-4 bg-dark-2 px-10 pb-6 pt-28 max-xl:hidden">
                <h3 className="text-heading4-medium text-light-1">You need to login to see your Followers</h3>
            </section>
        );
    }
    const followers = await fetchFollowers();
    const follows = await fetchFollows();
    return (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-fit flex-col justify-between gap-8 overflow-auto border-l border-l-dark-4 bg-dark-2 px-10 pb-6 pt-28 max-xl:hidden">
            <div className="flex flex-1 flex-col justify-start text-light-1">

                <h3 className="text-heading4-medium text-light-1">Your Followers</h3>
                {
                    followers?.length == 0 ? "You have no Followers" : (
                        <div className="text-light-1 mt-3 h-56 bg-dark-1 p-2 overflow-y-scroll">
                            {followers?.map((user: Follower, index) => {
                                return <><UserCard key={index} userID={user.user2} name={user.seconduser.name} username={user.seconduser.thread_username} imageUrl={user.seconduser.thread_image} isright={true} ></UserCard><div className="w-full h-0.5 bg-dark-2 mt-3" /></>
                            })}

                        </div>)
                }

            </div>
            <div className="flex flex-1 flex-col justify-start text-light-1">
                <h3 className="text-heading4-medium text-light-1">You Follows</h3>
                {
                    follows?.length == 0 ? "You are not Following anyone" : (
                        <div className="text-light-1 mt-3 h-56 bg-dark-1 p-2">
                            {follows?.map((user: Follows, index) => {
                                return <><UserCard key={index} userID={user.user1} name={user.firstuser.name} username={user.firstuser.thread_username} imageUrl={user.firstuser.thread_image} isright={true} ></UserCard><div className="w-full h-0.5 bg-dark-2 mt-3" /></>
                            })}

                        </div>)
                }
            </div>
        </section>
    );
}