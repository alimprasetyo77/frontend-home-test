"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCategory, getCategories } from "@/services/category-service";
import { ICategory } from "@/types/category-type";
import { IResponsePaginationCategory } from "@/types/types";
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

import CustomPagination from "@/components/custom-pagination";
import { useDebounce } from "use-debounce";
import { DialogFormCategory } from "@/components/dialog-category";

const DashboardCategories = () => {
  const [categories, setCategories] = useState<IResponsePaginationCategory<ICategory[]>>();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [debounceValue] = useDebounce(categoryName, 500);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async (page?: number, limit?: number, search?: string) => {
    try {
      const result = await getCategories(page, limit, search);
      setCategories(result);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      await deleteCategory(categoryId);
      toast.success("Delete category successfuly.");
      fetchCategories();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<ICategory>[] = [
    {
      accessorKey: "name",
      header: () => <h3 className="text-center">Category</h3>,
      size: 225,
      cell: (info) => {
        const category = info.getValue() as string;
        return <p className="text-center text-sm text-slate-600 text-wrap py-3 px-4">{category}</p>;
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

        return <div className="text-center text-sm text-slate-600 text-wrap py-3 px-4">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: () => <h3 className="text-center">Actions</h3>,
      size: 225,
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="flex items-center justify-center gap-x-2 *:cursor-pointer py-3 px-4">
            <DialogFormCategory category={{ id: data.id, name: data.name }}>
              <span className="text-blue-600 underline underline-offset-2 decoration-blue-600">Edit</span>
            </DialogFormCategory>

            <AlertDialog>
              <AlertDialogTrigger>
                <span className="text-red-500 underline underline-offset-2 decoration-red-500">Delete</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Category</AlertDialogTitle>
                  <AlertDialogDescription>
                    Delete category “{data.name}”? This will remove it from master data permanently.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-500 cursor-pointer"
                    onClick={() => handleDeleteCategory(data.id)}
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
        <h1 className="font-medium">Total Category : {categories?.totalData}</h1>
      </div>
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="flex items-center bg-white rounded-[6px] overflow-hidden w-full grow border border-slate-300 h-[36px]">
            <Search className="ml-2 size-4 text-muted-foreground" />
            <Input
              className="bg-transparent border-none ring-0 focus-visible:ring-0 text-sm h-auto!"
              placeholder="Search Category"
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
        </div>
        <DialogFormCategory>
          <Button className="bg-blue-600 hover:bg-blue-700 cursor-pointer h-10">
            <Plus className="size-[10px]" />
            <span>Add Category</span>
          </Button>
        </DialogFormCategory>
      </div>
      <DataTable
        columns={columns}
        data={categories?.data ?? []}
        isLoading={isLoading}
        filterCategory={{ name: debounceValue }}
        tableType="category"
      />
      <div className="flex items-center justify-center px-6 py-4 border-t border-t-slate-200">
        <CustomPagination
          onPageChange={(page) => fetchCategories(page, 10, debounceValue)}
          page={categories?.currentPage as number}
          totalPages={categories?.totalPages as number}
        />
      </div>
    </div>
  );
};

export default DashboardCategories;
