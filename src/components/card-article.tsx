"use client";
import { IArticle } from "@/types/article-type";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const CardArticle = ({ data }: { data: IArticle }) => {
  const router = useRouter();
  return (
    <Card className="p-0! shadow-none border-none gap-4">
      <CardHeader className="p-0! cursor-pointer" onClick={() => router.push(`/articles/${data.id}`)}>
        <Image
          src={data.imageUrl}
          alt={data.title}
          width={134}
          height={24}
          priority
          className="w-full aspect-video object-cover rounded-[12px]"
        />
      </CardHeader>
      <CardContent className="p-0! m-0! space-y-2">
        <span className="pt-4 text-muted-foreground text-sm">
          {new Date(data?.createdAt as string).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <CardTitle className="font-semibold text-lg">{data.title}</CardTitle>
        <div className="line-clamp-2 text-slate-600" dangerouslySetInnerHTML={{ __html: data.content }}></div>
      </CardContent>

      <CardFooter className="p-0!">
        <div className="flex items-center">
          <Button size={"sm"} className="rounded-full bg-blue-200 text-blue-900 hover:bg-blue-300">
            {data.category.name}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardArticle;
