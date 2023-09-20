import Image from "next/image";
export default function HomeLoadingState() {
    return (<center>
        <div>
            <Image
                src='/assets/loaiding-state.png'
                alt='heart'
                width={40}
                height={40}
                className='cursor-pointer object-contain animate-spin'
            />

        </div>
    </center>
    );
}