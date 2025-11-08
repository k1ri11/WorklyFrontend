import { useState, useEffect, useCallback } from 'react';
import { TopPerformersResponse } from '../../../types';
import * as statisticsApi from '../services/statisticsApi';
import toast from 'react-hot-toast';

interface UseTopEngagementsParams {
  limit?: number;
  order?: 'asc' | 'desc';
  departmentId?: number;
  from?: string;
  to?: string;
}

interface UseTopEngagementsResult {
  data: TopPerformersResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTopEngagements = (params?: UseTopEngagementsParams): UseTopEngagementsResult => {
  const [data, setData] = useState<TopPerformersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await statisticsApi.getTopEngagements(params);
      setData(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке топ сотрудников';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params?.limit, params?.order, params?.departmentId, params?.from, params?.to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
};

