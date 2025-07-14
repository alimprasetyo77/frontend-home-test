"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteArticle, getArticles } from "@/services/article-service";
import { getCategories } from "@/services/category-service";
import { IArticle } from "@/types/article-type";
import { ICategory } from "@/types/category-type";
import { IResponsePaginationArticle } from "@/types/types";
import { Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import CustomPagination from "@/components/custom-pagination";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";

const DashboardArticles = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<IResponsePaginationArticle<IArticle[]>>();
  const [categories, setCategories] = useState<ICategory[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [debounceValue] = useDebounce(title, 500);

  useEffect(() => {
    fetchCategories();
    fetchArticles({ page: 1 });
  }, []);

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result.data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const fetchArticles = async (params: { page: number; search?: string; category?: string }) => {
    try {
      const result = await getArticles({
        limit: 10,
        page: params.page,
        title: params.search,
        category: params.category,
      });
      setArticles(result);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    setIsLoading(true);
    try {
      await deleteArticle(articleId);
      toast.success("Delete article successfuly.");
      location.reload();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<IArticle>[] = [
    {
      accessorKey: "imageUrl",
      header: () => <h3 className="pl-2 text-center">Thumbnails</h3>,
      size: 225,
      cell: (info) => (
        <div className="flex items-center justify-center">
          <Image
            src={info.row.original.imageUrl}
            alt={info.row.original.title}
            width={134}
            height={24}
            priority
            className="size-[60px] object-cover rounded-[6px]"
          />
        </div>
      ),
    },
    {
      accessorKey: "title",
      header: () => <h3 className="text-center">Title</h3>,
      size: 225,
      cell: (info) => {
        const title = info.getValue() as string;
        return <p className="text-center text-sm text-slate-600 text-wrap">{title}</p>;
      },
    },
    {
      accessorKey: "categoryId",
      header: () => <h3 className="text-center">Category</h3>,
      size: 225,
      cell: (info) => {
        return (
          <p className="text-center text-sm text-slate-600 text-wrap">{info.row.original.category.name}</p>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <h3 className="text-center">Created At</h3>,
      size: 225,
      cell: (info) => {
        const date = new Date(info.row.original.createdAt);

        const datePart = date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        const timePart = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });

        const formatted = `${datePart} ${timePart}`;

        return <div className="text-center text-sm text-slate-600 text-wrap">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => <h3 className="text-center">Actions</h3>,
      size: 225,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex items-center justify-center gap-x-2 *:cursor-pointer">
            <span
              className="text-blue-600 underline underline-offset-2 decoration-blue-600"
              onClick={() => {
                window.open(
                  `/preview?title=${encodeURIComponent(data.title)}&image=${data.imageUrl}&categoryId${
                    data.category
                  }&content=${encodeURIComponent(data.content)}`,
                  "_blank"
                );
              }}
            >
              Preview
            </span>

            <span
              className="text-blue-600 underline underline-offset-2 decoration-blue-600"
              onClick={() => router.push(`/dashboard/articles/form?id=${data.id}`)}
            >
              Edit
            </span>

            <AlertDialog>
              <AlertDialogTrigger>
                <span className="text-red-500 underline underline-offset-2 decoration-red-500">Delete</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Articles</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deleting this article is permanent and cannot be undone. All related content will be
                    removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-500 cursor-pointer"
                    onClick={() => handleDeleteArticle(data.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-[12px] border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="font-medium">Total Articles : {articles?.total}</h1>
      </div>
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Select
            onValueChange={(v) => {
              if (v === "all-categories") {
                setCategory("");
              } else {
                setCategory(v);
              }
            }}
          >
            <SelectTrigger className="w-auto bg-white text-gray-900! font-medium h-[36px]!">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key={"all-categories"} value={"all-categories"}>
                All Categories
              </SelectItem>
              {categories?.map((category) => {
                if (!Boolean(category.id)) return;
                return (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <div className="flex items-center bg-white rounded-[6px] overflow-hidden w-full grow border border-slate-300 h-[36px]">
            <Search className="ml-2 size-4 text-muted-foreground" />
            <Input
              className="bg-transparent border-none ring-0 focus-visible:ring-0 text-sm h-auto!"
              placeholder="Search articles"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer h-10"
          onClick={() => {
            router.push("/dashboard/articles/form");
          }}
        >
          <Plus className="size-[10px]" />
          <span>Add Articles</span>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={articles?.data ?? []}
        isLoading={isLoading}
        filtersArticle={{ title: debounceValue, category }}
        tableType="article"
      />
      <div className="flex items-center justify-center px-6 py-4 border-t border-t-slate-200">
        <CustomPagination
          onPageChange={(page) => fetchArticles({ page, category, search: debounceValue })}
          page={articles?.page as number}
          totalPages={articles?.total as number}
        />
      </div>
    </div>
  );
};

export default DashboardArticles;
