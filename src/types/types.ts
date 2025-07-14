export interface IResponsePaginationArticle<T> {
  data: T;
  limit: number;
  page: number;
  total: number;
}
export interface IResponsePaginationCategory<T> {
  data: T;
  totalData: number;
  currentPage: number;
  totalPages: number;
}
