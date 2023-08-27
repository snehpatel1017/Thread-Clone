"use client";

import { OutputData } from "@editorjs/editorjs";
import Output from "editorjs-react-renderer";
import Image from "next/image";

interface EditorViewerProps {
  data: any;
}

export default function EditorViewer({ data }: EditorViewerProps) {
  return (

    <Output
      renderers={{
        image: CustomImageRenderer,
        code: CustomCodeRenderer,
        paragraph: CustomParagraphRenderer,
      }}
      className="text-sm bg-dark-2 w-full"
      data={data}
    />

  );
}

function CustomParagraphRenderer({ data }: any) {
  return (
    <div className="relative w-full flex flex-col justify-center ">
      <div className="font-serif  pt-3">
        {data.text}
      </div>
    </div>
  );
}

function CustomImageRenderer({ data }: any) {
  const src = data.file.url;

  return (
    <div className="relative min-h-[15rem] w-full flex flex-col justify-center ">
      <div>
        <Image alt="image" className="rounded-2xl" width={250} height={190} src={src} />
      </div>
      <div className="font-sans py-3">
        <label className="font-serif">{data.caption}</label>
      </div>
    </div>
  );
}
function CustomCodeRenderer({ data }: any) {
  return (
    <pre className="rounded-md bg-gray-800 py-4">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
}

