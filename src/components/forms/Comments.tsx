'use client';

import { addingComment } from "@/actions/Thread";
import { Label, Textarea } from "flowbite-react";
import { useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ZodError } from "zod";
import { json } from "stream/consumers";


export default function Comments({ data, threadId }: any) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    async function handleSubmit(event: any) {
        event.preventDefault();
        setLoading(true);
        const formdata = {
            //@ts-ignore
            'text': text,
            'threadId': threadId,
            'path': pathname,
        }


        await addingComment(formdata);
        setLoading(false);
        //@ts-ignore
        setText("")
    }
    //@ts-ignore
    return (
        <div>
            <form className='flex items-center gap-4 border-y border-y-dark-4 py-5 max-xs:flex-col' onSubmit={handleSubmit}>
                <img className="rounded-full w-10 h-10 object-cover" src={data.user.thread_image} alt="Rounded avatar" />

                <input id="comment" onChange={(e) => setText(e.target.value)} className="bg-dark-1 border-none py-2 px-2 text-light-2 rounded-lg outline-none w-full" value={text} placeholder="Comments..." required />
                <button type="submit" className="rounded-3xl bg-primary-500 px-8 py-2 !text-small-regular text-light-1 max-xs:w-full" disabled={loading}>
                    {
                        loading ? (
                            <svg className="animate-spin w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                            </svg>
                        ) : (
                            "Reply"
                        )
                    }
                </button>
            </form>
        </div>
    )
}


