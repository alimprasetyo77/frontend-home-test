import z from "zod";

export const CreateUpdateCategorySchema = z.object({
  name: z.string().nonempty({ error: "Category field cannot be empty" }),
});

export type CreateUpdateCategoryType = z.infer<typeof CreateUpdateCategorySchema>;

export interface ICategory {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
