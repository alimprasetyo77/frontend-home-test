import api from "@/lib/axios-config";
import { CreateArticleType, IArticle, UpdateArticleType } from "@/types/article-type";
import { IResponsePaginationArticle } from "@/types/types";

interface ArticlesPayload {
  limit: number;
  page: number;
  title?: string;
  category?: string;
}

export const getArticles = async ({ limit, page, title, category }: ArticlesPayload) => {
  try {
    const response = await api.get("/articles", {
      params: { limit, page, ...(title && { title }), ...(category && { category }) },
    });
    return response.data as IResponsePaginationArticle<IArticle[]>;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};

export const getArticle = async (articleId: string) => {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response.data as IArticle;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const createArticle = async (body: CreateArticleType) => {
  try {
    const response = await api.post(`/articles`, body);
    return response.data as IArticle;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const updateArticle = async (body: UpdateArticleType) => {
  try {
    const response = await api.put(`/articles`, body);
    return response.data as IArticle;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
export const deleteArticle = async (articleId: string) => {
  try {
    const response = await api.delete(`/articles/${articleId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};

export const uploadImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post(`/upload`, formData);
    return response.data as { imageUrl: string };
  } catch (error: any) {
    const message = error.response.data.error;
    throw new Error(message);
  }
};
