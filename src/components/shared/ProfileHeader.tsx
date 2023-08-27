interface Props {
    imageUrl: string,
    username: string,
    name: string,
    bio: string,
}

export default function ProfileHeader({ imageUrl, username, name, bio }: Props) {
    return (

        <div className="flex flex-col justify-start">
            <div className="flex justify-between ">
                <div className="flex items-center gap-3">
                    <div className="">
                        <img src={imageUrl} className="rounded-full w-20 h-20"></img>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-heading3-bold">{name}</h3>
                        <p className='text-base-medium text-gray-1'>@{username}</p>
                    </div>
                </div>
            </div>
            <p className="mt-3 text-light-2 text-base-regular">{bio}</p>
            <div className="h-0.5 bg-dark-2 w-full mt-6" ></div>
        </div>
    );
}