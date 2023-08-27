"use client";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { makeThread } from "@/actions/Thread";
import type EditorJS from "@editorjs/editorjs";
import type EditorConfig from "@editorjs/editorjs";

interface EditorProps {
    subredditName: string;
}
export default function CreateThread() {
    const router = useRouter();
    const ref = useRef<EditorJS>();
    const pathname = usePathname();
    async function handleSubmit() {
        const editorData = await ref.current?.save();



        const communityId = null
        const path = pathname

        try {

            await makeThread({ communityId, path }, editorData)
        }
        catch (err) {
            alert(err.issues[0].message)
        }
        console.log("Sucees")


    }
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import("@editorjs/editorjs")).default;
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
                <button onClick={handleSubmit} className="my-3 bg-sky-700 hover:bg-sky-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

            </div>
        </section>
    </main>
    );
}

