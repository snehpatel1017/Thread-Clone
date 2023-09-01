"use client";
import { data } from "autoprefixer";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "path";

export default function AccountProfile() {
    const { data, status } = useSession();
    const router = useRouter();
    if (status !== 'authenticated') router.push("/sign-in")
    const [image, setImage] = useState(data?.user.thread_image == null ? data?.user.image : data.user.thread_image);
    const [username, setUsername] = useState(data?.user.thread_username == null ? data?.user.name : data.user.thread_username);
    const [bio, setBio] = useState(data?.user.thread_bio == null ? "" : data.user.thread_bio);
    const [loading, setLoading] = useState(false);
    const [isChange, setChange] = useState(false);
    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    async function handleSubmit(event: any) {
        setLoading(true)
        event.preventDefault();

        const imageurl = isChange == true ? image : data?.user.thread_image == null ? null : image

        const formdata = {
            'username': username,
            'userimage': imageurl,
            'userbio': bio,
        }
        axios.post("http://localhost:3000/api/profileupdate/", formdata)
            .then((res) => {
                setChange(false);
                setLoading(false);
                router.push('/');
            })
            .catch((err) => {
                setChange(false);
                setLoading(false)
                alert(err.response.data)
            });

    }

    return (
        <main>

            <h2 className="text-heading2-bold text-light-1"> AccountProfile</h2>
            <section
                className="text-light-1">
                <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                            <div className="sm:col-span-2 flex flex-row justify-start">
                                <img className="rounded-full" src={image} width={100} height={100} alt="Rounded avatar" />
                                <input className="py-9 px-4 w-72" id="small_size" type="file" accept="image/*" onChange={async (e) => { setChange(true); setImage(await toBase64(e.target.files[0])); }}></input>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="name" className="block mb-2 text-sm font-medium dark:text-white">User Name</label>
                                <input onChange={(e) => setUsername(e.target.value.toLowerCase())} type="text" name="name" id="name" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={username} placeholder={data?.user.name} />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="email" className="block mb-2 text-sm font-medium  dark:text-white">Email</label>
                                <input type="text" name="email" id="email" className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark: dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={data?.user.email} placeholder="Type product name" disabled readOnly />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="description" className="block mb-2 text-sm font-medium  dark:text-white">Bio</label>
                                <textarea id="description" onChange={(e) => setBio(e.target.value)} name="bio" rows={8} className="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" value={bio} placeholder="Write a product description here..."></textarea>
                            </div>

                        </div>

                        <button type="submit" className="bg-sky-300 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={loading ? true : false}>
                            {
                                loading ? (
                                    <svg className="animate-spin w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                                    </svg>
                                ) : (
                                    "Submit"
                                )
                            }
                        </button>


                    </form>
                </div>
            </section>
        </main>
    );
}