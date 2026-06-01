import type { ReactNode } from "react";

export interface ApiError {
  message: string;
  status?: number;
}

export interface TableColumn<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}
