'use client';

import { addingComment } from "@/actions/Thread";
import { Label, Textarea } from "flowbite-react";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ZodError } from "zod";
import { json } from "stream/consumers";


export default function Comments({ data, threadId }: any) {
    const [text, setText] = useState("");
    const pathname = usePathname();
    const router = useRouter();
    async function handleSubmit(event: any) {
        event.preventDefault();
        const formdata = {
            //@ts-ignore
            'text': text,
            'threadId': threadId,
            'path': pathname,
        }


        await addingComment(formdata);
        //@ts-ignore
        setText("")
    }
    //@ts-ignore
    return (
        <div>
            <form className='flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col' onSubmit={handleSubmit}>
                <img className="rounded-full w-10 h-10 object-cover" src={data.user.thread_image} alt="Rounded avatar" />

                <input id="comment" onChange={(e) => setText(e.target.value)} className="bg-dark-1 border-none py-2 px-2 text-light-2 rounded-lg outline-none w-full" placeholder="Comments..." required />
                <button type="submit" className="rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full">Reply</button>
            </form>
        </div>
    )
}


