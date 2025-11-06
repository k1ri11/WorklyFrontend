import { useState, useEffect, useCallback } from 'react';
import { UserDTO, UserFilters } from '../../../types';
import * as usersApi from '../services/usersApi';
import toast from 'react-hot-toast';

interface UseUsersResult {
  users: UserDTO[];
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  deleteUser: (id: number) => Promise<void>;
}

export const useUsers = (initialFilters?: UserFilters): UseUsersResult => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialFilters?.page || 1);
  const [pageSize, setPageSize] = useState(initialFilters?.page_size || 20);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters || {});

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await usersApi.listUsers({
        ...filters,
        page: currentPage,
        page_size: pageSize,
      });
      
      setUsers(response.users || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 0);
      setCurrentPage(response.page || 1);
      setPageSize(response.page_size || 20);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке списка сотрудников';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (id: number) => {
    try {
      await usersApi.deleteUser(id);
      toast.success('Сотрудник успешно удалён');
      fetchUsers();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при удалении сотрудника. Попробуйте позже.';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    users,
    total,
    totalPages,
    currentPage,
    pageSize,
    isLoading,
    error,
    refetch: fetchUsers,
    deleteUser,
  };
};

