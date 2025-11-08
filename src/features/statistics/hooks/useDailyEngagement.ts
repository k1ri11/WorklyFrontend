import { useState, useEffect, useCallback, useMemo } from 'react';
import { DailyEngagementResponse } from '../../../types';
import * as statisticsApi from '../services/statisticsApi';
import toast from 'react-hot-toast';

interface UseDailyEngagementParams {
  departmentId: number | undefined;
  from: string;
  to: string;
}

interface UseDailyEngagementResult {
  data: DailyEngagementResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDailyEngagement = ({ departmentId, from, to }: UseDailyEngagementParams): UseDailyEngagementResult => {
  const [data, setData] = useState<DailyEngagementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!departmentId) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await statisticsApi.getDailyEngagement({
        departmentId,
        from,
        to,
      });
      setData(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке данных вовлеченности';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [departmentId, from, to]);

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

