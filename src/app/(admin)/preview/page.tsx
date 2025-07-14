"use client";

// import CardArticle from "@/components/card-article";
import { useAuth } from "@/context/auth-context";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const PreviewArticle = () => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const image = searchParams.get("image");
  const content = searchParams.get("content");
  // const categoryId = searchParams.get("categoryId");

  return (
    <div className="py-10 px-5">
      <div className="container mx-auto space-y-6 md:space-y-10">
        <header className="space-y-4">
          <div className="flex items-center justify-center text-sm text-slate-600 font-medium gap-1">
            <span>
              {new Date(Date.now()).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="px-1">•</span>
            <span> Created By {user?.username}</span>
          </div>
          <h1 className="text-slate-900 font-semibold text-2xl md:text-3xl leading-8 md:leading-9 text-center">
            {title}
          </h1>
        </header>
        <Image
          src={image ?? ""}
          width={335}
          height={240}
          alt={title ?? ""}
          className="w-[335px] md:w-full h-[240px] md:h-[480px] rounded-[12px] object-contain object-center"
        />
        <article className="prose" dangerouslySetInnerHTML={{ __html: content ?? <></> }}></article>
      </div>
    </div>
  );
};

export default PreviewArticle;
