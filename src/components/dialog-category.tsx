"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreateUpdateCategorySchema, CreateUpdateCategoryType } from "@/types/category-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { toast } from "sonner";
import { createCategory, updateCategory } from "@/services/category-service";

export function DialogFormCategory({
  category,
  children,
}: {
  category?: { id: string; name: string };
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(CreateUpdateCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!category) return;
    form.reset({ name: category.name });
  }, [category]);

  const onSubmit = async (value: CreateUpdateCategoryType) => {
    try {
      if (category) {
        await updateCategory(category.id, value);
        toast.success("Update Category Successfull.");
      } else {
        await createCategory(value);
        toast.success("Create Category Successfull.");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{category ? "Edit" : "Add"} Category</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Input Category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                aria-disabled={form.formState.isSubmitting || !form.formState.isDirty}
              >
                {category ? "Save Changes" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
