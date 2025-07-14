"use client";
import { CreateArticleSchema, CreateArticleType, UpdateArticleType } from "@/types/article-type";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ICategory } from "@/types/category-type";
import { toast } from "sonner";
import { getCategories } from "@/services/category-service";
import TextEditor from "@/components/text-editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createArticle, getArticle, updateArticle, uploadImage } from "@/services/article-service";
import Image from "next/image";

const FormArticle = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditForm, setIsEditForm] = useState(false);
  const inputThumbRef = useRef<HTMLInputElement | null>(null);
  const [categories, setCategories] = useState<ICategory[]>();
  const [isLoadingUploadImg, setIsLoadingUploadImg] = useState(false);

  const form = useForm({
    resolver: zodResolver(CreateArticleSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      content: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    const articleId = searchParams.get("id");
    if (!articleId) return;
    fetchArticle(articleId);
  }, [searchParams]);

  const fetchArticle = async (articleId: string) => {
    try {
      const result = await getArticle(articleId);
      form.reset({
        title: result.title,
        categoryId: result.categoryId,
        imageUrl: result.imageUrl,
        content: result.content,
      });
      setIsEditForm(true);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result.data);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsLoadingUploadImg(true);
      const result = await uploadImage(file);
      form.setValue("imageUrl", result.imageUrl);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoadingUploadImg(false);
    }
  };

  const onSubmit = async (values: CreateArticleType | UpdateArticleType) => {
    try {
      if (isEditForm) {
        await updateArticle(values);
        toast.success("Update Article Successfull.");
      } else {
        await createArticle(values);
        toast.success("Create Article Successfull.");
      }
      router.push("/dashboard/articles");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handlePreviewArticle = () => {
    window.open(
      `/preview?title=${encodeURIComponent(form.getValues("title"))}&image=${form.getValues(
        "imageUrl"
      )}&categoryId${form.getValues("categoryId")}&content=${encodeURIComponent(form.getValues("content"))}`,
      "_blank"
    );
  };

  return (
    <div className="bg-gray-50 rounded-[12px] border border-slate-200">
      <div className="flex items-center gap-2 p-5">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="font-medium">Create Article</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Image input */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => {
              const previewThumbnail = field.value;
              return (
                <FormItem className="space-y-1">
                  <h4 className="font-medium text-sm">Thumbnails</h4>
                  <div
                    className={`bg-white w-full min-h-[163px] max-w-[223px] border border-dashed border-slate-300 text-slate-500 text-xs font-medium rounded-[8px] flex flex-col items-center justify-center p-3 gap-3 ${
                      !previewThumbnail && "cursor-pointer"
                    }`}
                    onClick={() => {
                      if (previewThumbnail) return;
                      inputThumbRef.current?.click();
                    }}
                  >
                    {isLoadingUploadImg ? (
                      <>
                        <Loader2 className="animate-spin duration-300" />
                        <span>Uploading image...</span>
                      </>
                    ) : previewThumbnail ? (
                      <>
                        <Image
                          src={previewThumbnail}
                          alt="brand logo"
                          width={134}
                          height={24}
                          priority
                          className="w-full h-full rounded-[6px]"
                        />
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs text-blue-600 underline underline-offset-2 cursor-pointer"
                            onClick={() => inputThumbRef.current?.click()}
                          >
                            Changes
                          </span>
                          <span
                            className="text-xs text-red-500 underline underline-offset-2 cursor-pointer"
                            onClick={() => form.resetField("imageUrl", { defaultValue: "" })}
                          >
                            Delete
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImagePlus className="size-5" />
                        <span>Click to select files</span>
                        <span>Suport File Type : jpg or png</span>
                      </>
                    )}
                  </div>
                  <FormMessage />
                  <FormControl>
                    <input
                      type="file"
                      hidden
                      name="thumbnails"
                      id="thumbnails"
                      onChange={handleUploadImage}
                      disabled={isLoadingUploadImg}
                      ref={inputThumbRef}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          {/* Image input */}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Input title" className="bg-white" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextEditor onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="py-4 flex items-center justify-end gap-2 *:cursor-pointer">
            <button
              className={cn(buttonVariants({ variant: "outline" }))}
              type="button"
              onClick={() => form.reset()}
              disabled={!form.formState.isDirty}
            >
              Cancel
            </button>

            <button
              className={cn(buttonVariants({ variant: "outline", className: "bg-slate-200" }))}
              type="button"
              disabled={!form.formState.isDirty}
              onClick={handlePreviewArticle}
            >
              Preview
            </button>

            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              aria-disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              Upload
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormArticle;
