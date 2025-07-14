"use client";

import CardArticle from "@/components/card-article";
import CustomPagination from "@/components/custom-pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getArticles } from "@/services/article-service";
import { getCategories } from "@/services/category-service";
import { IArticle } from "@/types/article-type";
import { ICategory } from "@/types/category-type";
import { Search } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

export default function Articles() {
  const [limit] = useState(9);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [debouncedSearch] = useDebounce(search, 500);

  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result.data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const fetchArticles = useCallback(async () => {
    try {
      const result = await getArticles({
        limit,
        page,
        title: debouncedSearch,
        category,
      });
      setArticles(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }, [limit, page, debouncedSearch, category]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCategoryChange = (val: string) => {
    setPage(1);
    setCategory(val.startsWith("all-categories") ? "" : val);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== page) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[560px] md:min-h-[500px] bg-[#2563EBDB] bg-blend-overlay bg-center bg-cover bg-[url('/images/hero-background.jpg')] flex items-center justify-center">
        <div className="flex flex-col items-center gap-10 max-w-[337px] sm:max-w-[730px]">
          <div className="w-full flex flex-col text-white gap-3 text-center">
            <h1 className="font-bold text-sm md:text-base">Blog genzet</h1>
            <p className="text-4xl md:text-5xl leading-[40px] md:leading-[48px]">
              The Journal: Design Resources, Interviews, and Industry News
            </p>
            <span className="text-xl md:text-2xl">Your daily dose of design insights!</span>
          </div>

          {/* Filter */}
          <div className="flex flex-col md:flex-row items-center gap-2 w-full max-w-[608px] min-h-[60px] p-2.5 bg-[#3B82F6] rounded-[12px]">
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-[180px] bg-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                {categories.map((cat) =>
                  cat.id ? (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
            <div className="flex items-center bg-white rounded-[6px] overflow-hidden w-full">
              <Search className="ml-2 size-4 text-muted-foreground" />
              <Input
                className="bg-transparent border-none ring-0 focus-visible:ring-0 text-sm md:text-base"
                placeholder="Search articles"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-10 px-5 md:p-16">
        <div className="container mx-auto space-y-8">
          <h3 className="hidden md:block text-slate-600 font-medium">
            Showing: {Math.min(page * limit, total)} of {total} articles
          </h3>

          {articles.length === 0 ? (
            <p className="text-center text-slate-500">No articles found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              {articles.map((article) => (
                <CardArticle key={article.id} data={article} />
              ))}
            </div>
          )}

          <CustomPagination
            page={page}
            totalPages={Math.ceil(total / limit)}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
}
