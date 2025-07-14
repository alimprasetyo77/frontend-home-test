import z from "zod";
import { IUser } from "./auth-type";
import { ICategory } from "./category-type";

export const CreateArticleSchema = z.object({
  title: z.string().nonempty({ error: "Please enter title" }),
  content: z.string().nonempty({ error: "Content field cannot be empty" }),
  imageUrl: z.string().nonempty({ error: "Please enter picture" }),
  categoryId: z.string().nonempty({ error: "Please select category" }),
});
export const UpdateArticleSchema = CreateArticleSchema;

export type CreateArticleType = z.infer<typeof CreateArticleSchema>;
export type UpdateArticleType = z.infer<typeof UpdateArticleSchema>;

export interface IArticle {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  userId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: ICategory;
  user: IUser;
}
