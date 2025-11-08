import { useState, useEffect } from 'react';
import { UserDTO, DepartmentUsersResponse } from '../../../types';
import * as departmentsApi from '../services/departmentsApi';
import toast from 'react-hot-toast';

interface UseDepartmentUsersResult {
  users: UserDTO[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDepartmentUsers = (departmentId: number | string | undefined): UseDepartmentUsersResult => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!departmentId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response: DepartmentUsersResponse = await departmentsApi.getDepartmentUsers(Number(departmentId));
      setUsers(response.users || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке сотрудников отдела';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [departmentId]);

  return {
    users,
    total,
    isLoading,
    error,
    refetch: fetchUsers,
  };
};

