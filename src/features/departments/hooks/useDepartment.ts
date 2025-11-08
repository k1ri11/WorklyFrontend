import { useState, useEffect } from 'react';
import { DepartmentDTO } from '../../../types';
import * as departmentsApi from '../services/departmentsApi';
import toast from 'react-hot-toast';

interface UseDepartmentResult {
  department: DepartmentDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDepartment = (id: number | string | undefined): UseDepartmentResult => {
  const [department, setDepartment] = useState<DepartmentDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartment = async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await departmentsApi.getDepartmentById(Number(id));
      setDepartment(data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setDepartment(null);
        setError('Отдел не найден');
      } else {
        const errorMessage = err.response?.data?.error || 'Ошибка при загрузке информации об отделе';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, [id]);

  return {
    department,
    isLoading,
    error,
    refetch: fetchDepartment,
  };
};

