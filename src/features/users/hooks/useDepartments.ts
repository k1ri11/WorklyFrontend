import { useState, useEffect } from 'react';
import { DepartmentDTO } from '../../../types';
import * as departmentsApi from '../services/departmentsApi';
import toast from 'react-hot-toast';

interface UseDepartmentsResult {
  departments: DepartmentDTO[];
  isLoading: boolean;
  error: string | null;
}

export const useDepartments = (): UseDepartmentsResult => {
  const [departments, setDepartments] = useState<DepartmentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await departmentsApi.listDepartments({
          page: 1,
          page_size: 100,
        });
        setDepartments(response.departments || []);
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Ошибка при загрузке списка отделов';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return {
    departments,
    isLoading,
    error,
  };
};

