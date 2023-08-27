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
    const [image, setImage] = useState(data?.user.thread_image == null ? data?.user.image : data.user.thread_image);
    const [username, setUsername] = useState(data?.user.thread_username == null ? data?.user.name : data.user.thread_username);
    const [bio, setBio] = useState(data?.user.thread_bio == null ? "" : data.user.thread_bio);
    const router = useRouter();
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
                alert(res.data)
                router.push('/');
            })
            .catch((err) => {
                setChange(false);
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

                        <button type="submit" className="bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {loading == true ? (
                                <><svg aria-hidden="true" className="inline w-8 h-8   text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg><span className="sr-only">Loading...</span></>

                            ) : ("Submit")}</button>
                    </form>
                </div>
            </section>
        </main>
    );
}