"use client";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { makeThread } from "@/actions/Thread";
import type EditorJS from "@editorjs/editorjs";
import type EditorConfig from "@editorjs/editorjs";

interface EditorProps {
    subredditName: string;
}
export default function CreateThread() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const ref = useRef<EditorJS>();
    const pathname = usePathname();
    async function handleSubmit() {
        setLoading(true);
        const editorData = await ref.current?.save();



        const communityId = null
        const path = pathname

        try {

            await makeThread({ communityId, path }, editorData)
            router.push("/")
        }
        catch (err: any) {
            setLoading(false)
            alert(err.message)
        }



    }
    const toBase64 = (file: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        //@ts-ignore
        const Header = (await import("@editorjs/header")).default;
        //@ts-ignore
        const Embed = (await import("@editorjs/embed")).default;
        //@ts-ignore
        const List = (await import("@editorjs/list")).default;
        //@ts-ignore
        const Table = (await import("@editorjs/table")).default;
        //@ts-ignore
        const Code = (await import("@editorjs/code")).default;
        //@ts-ignore
        const InlineCode = (await import("@editorjs/inline-code")).default;
        //@ts-ignore
        const ImageTool = (await import("@editorjs/image")).default;

        const editor = new EditorJS({
            holder: "editorjs",
            placeholder: "write your posts",
            inlineToolbar: true,
            onReady: () => {
                ref.current = editor;
            },
            tools: {
                header: Header,
                image: {
                    class: ImageTool,
                    config: {
                        uploader: {
                            async uploadByFile(file: File) {
                                // upload to uploadthing
                                const res = await toBase64(file);
                                console.log(res)
                                return {
                                    success: 1,
                                    file: {
                                        url: res,
                                    },
                                };
                            },
                        },
                    },
                },
                list: List,
                code: Code,
                inlineCode: InlineCode,
                table: Table,
                embed: Embed,
            },
        });
    }, []);

    useEffect(() => {
        if (ref.current) ref.current.destroy();
        initializeEditor();
    }, [initializeEditor]);

    return (<main>
        <section
            className="text-white">
            <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">

                <div className="text-dark-2 ">

                    {/* <div className="sm:col-span-2"> */}
                    <div id="editorjs" className="rounded-lg border text-white p-2 w-full" />
                    {/* <label htmlFor="body" className="block mb-2 text-sm font-medium  dark:text-white">Body</label> */}
                    {/* <textarea id="body" name="body" rows={8} className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Write a product description here..."></textarea> */}
                    {/* </div> */}

                </div>
                <button onClick={handleSubmit} className="my-3 bg-sky-700 hover:bg-sky-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={loading}>{loading ? (
                    <svg className="animate-spin w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                    </svg>
                ) : "Post"}</button>

            </div>
        </section>
    </main>
    );
}

