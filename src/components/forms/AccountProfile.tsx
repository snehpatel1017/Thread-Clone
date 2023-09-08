"use client";
import { data } from "autoprefixer";
import { useSession } from "next-auth/react";
import Image from 'next/image'
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "path";
import ReactCrop, { type Crop } from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';


const toBase64 = (file: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

function CorppingImage(oldimag: any, src: any, setisCrop: any, setOutput: any, image: any, setImage: any, crop: any, setCrop: any) {


    const cropImageNow = () => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx!.imageSmoothingQuality = 'high';
        ctx?.drawImage(
            image!,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height,
        );
        setOutput(canvas.toDataURL("image/jpeg"));
        setisCrop(false)
    };
    return (
        <main className="flex flex-col gap-3">
            <div>
                <ReactCrop className='w-full' crop={crop} circularCrop={true} onChange={c => setCrop(c)} minHeight={350} maxHeight={350} minWidth={350} maxWidth={350}>
                    <img src={src} className="w-full" onLoad={(e) => {
                        setImage(e.currentTarget);
                    }}></img>

                </ReactCrop>
            </div>
            <div className="flex justify-between">
                <button type="submit" className="bg-sky-300 w-full  hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={cropImageNow}>Crop</button>
                <button type="submit" className="bg-sky-300 w-full  hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={(e) => { setOutput(oldimag); setisCrop(false); }}>Back</button>
            </div>
        </main>
    );
}


export default function AccountProfile() {
    const [crop, setCrop] = useState({
        unit: 'px', // Can be 'px' or '%'
        x: 0,
        y: 0,
        width: 350,
        height: 350,
    });
    const [cropimage, setcropImage] = useState<any>(null);
    const { data, status } = useSession();
    const [output, setOutput] = useState("");
    const router = useRouter();
    if (status !== 'authenticated') router.push("/sign-in")
    const [image, setImage] = useState<any>(data?.user.thread_image);
    const [username, setUsername] = useState(data?.user.thread_username);
    const [bio, setBio] = useState(data?.user.thread_bio);
    const [loading, setLoading] = useState(false);
    const [isChange, setChange] = useState(false);
    const [isCrop, setisCrop] = useState(false);

    async function handleSubmit(event: any) {
        setLoading(true)
        event.preventDefault();
        const formdata = {
            'username': username,
            'userimage': image,
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

    async function handleCropping(file: Blob) {
        setImage(await toBase64(file))
        setisCrop(true);
    }

    return (
        <main>

            <h2 className="text-heading2-bold text-light-1"> AccountProfile</h2>
            <section
                className="text-light-1">
                <div className="max-w-2xl px-4 py-8 mx-auto lg:py-16">
                    {
                        isCrop ? CorppingImage(data?.user.thread_image, image, setisCrop, setImage, cropimage, setcropImage, crop, setCrop) :
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                                    <div className="sm:col-span-2 flex flex-row justify-start">
                                        <img className="rounded-full object-cover w-24 h-24" src={image} alt="Rounded avatar" />

                                        <input className="py-9 px-4 w-72" id="small_size" type="file" accept="image/*" onChange={(e) => { handleCropping(e.target.files![0]) }}></input>
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
                    }
                </div>
            </section>
        </main>
    );
}

