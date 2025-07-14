import CardArticle from "@/components/card-article";
import { getArticle, getArticles } from "@/services/article-service";
import Image from "next/image";

interface ArticleDetailProps {
  params: Promise<{ articleId: string }>;
}
const ArticleDetail = async ({ params }: ArticleDetailProps) => {
  const { articleId } = await params;
  const article = await getArticle(articleId);
  const otherArticle = await getArticles({ limit: 3, page: 1, category: article.category.id });
  return (
    <div className="py-10 px-5">
      <div className="container mx-auto space-y-6 md:space-y-10">
        <header className="space-y-4">
          <div className="flex items-center justify-center text-sm text-slate-600 font-medium gap-1">
            <span>
              {new Date(article.createdAt as string).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="px-1">•</span>
            <span>Created By {article.user.username}</span>
          </div>
          <h1 className="text-slate-900 font-semibold text-2xl md:text-3xl leading-8 md:leading-9 text-center">
            {article.title}
          </h1>
        </header>
        <Image
          src={article.imageUrl}
          width={335}
          height={240}
          alt={article.title}
          className="w-[335px] md:w-full h-[240px] md:h-[480px] rounded-[12px] object-contain object-center"
        />
        <article dangerouslySetInnerHTML={{ __html: article.content }}></article>
        <div className="space-y-6 py-5">
          <h1 className="text-slate-900 font-bold text-lg">Other articles</h1>
          <div className="grid md:grid-cols-3 gap-10">
            {otherArticle.data.map((article) => (
              <CardArticle key={article.id} data={article} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
