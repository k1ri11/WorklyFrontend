import { useState, useEffect, useCallback } from 'react';
import { DepartmentDTO, DepartmentListResponse } from '../../../types';
import * as departmentsApi from '../services/departmentsApi';
import toast from 'react-hot-toast';

interface DepartmentFilters {
  page?: number;
  page_size?: number;
  search?: string;
}

interface UseDepartmentsListResult {
  departments: DepartmentDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDepartmentsList = (filters: DepartmentFilters = {}): UseDepartmentsListResult => {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  const [pageSize, setPageSize] = useState(filters.page_size || 20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: DepartmentListResponse = await departmentsApi.listDepartments({
        page: filters.page || currentPage,
        page_size: filters.page_size || pageSize,
        search: filters.search,
      });

      setDepartments(response.departments || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 0);
      setCurrentPage(response.page || 1);
      setPageSize(response.page_size || 20);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке списка отделов';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters.page, filters.page_size, filters.search, currentPage, pageSize]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    total,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    refetch: fetchDepartments,
  };
};

