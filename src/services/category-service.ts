import api from "@/lib/axios-config";
import { CreateUpdateCategoryType, ICategory } from "@/types/category-type";
import { IResponsePaginationCategory } from "@/types/types";

export const getCategories = async (page?: number, limit?: number, search?: string) => {
  try {
    const response = await api.get("/categories", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data as IResponsePaginationCategory<ICategory[]>;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const createCategory = async ({ name }: CreateUpdateCategoryType) => {
  try {
    const response = await api.post("/categories", { name });
    return response.data as ICategory;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const updateCategory = async (categoryId: string, { name }: CreateUpdateCategoryType) => {
  try {
    const response = await api.put(`/categories/${categoryId}`, { name });
    return response.data as ICategory;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
