import { useState, useEffect } from 'react';
import { DepartmentDetailsResponse } from '../../../types';
import * as statisticsApi from '../services/statisticsApi';
import toast from 'react-hot-toast';

interface UseDepartmentDetailsParams {
  departmentId: number | undefined;
  from: string;
  to: string;
}

interface UseDepartmentDetailsResult {
  data: DepartmentDetailsResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDepartmentDetails = ({ departmentId, from, to }: UseDepartmentDetailsParams): UseDepartmentDetailsResult => {
  const [data, setData] = useState<DepartmentDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!departmentId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await statisticsApi.getDepartmentDetails({
        departmentId,
        from,
        to,
      });
      setData(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке статистики отдела';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [departmentId, from, to]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

