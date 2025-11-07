import { useState, useEffect, useCallback } from 'react';
import { SessionDTO } from '../../../types';
import * as sessionsApi from '../services/sessionsApi';
import toast from 'react-hot-toast';
import { format, subDays } from 'date-fns';

interface UseSessionHistoryResult {
  sessions: SessionDTO[];
  isLoading: boolean;
  error: string | null;
  fromDate: string;
  toDate: string;
  setDateRange: (from: string, to: string) => void;
  refetch: () => void;
}

export const useSessionHistory = (userId: number | undefined): UseSessionHistoryResult => {
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const defaultToDate = format(new Date(), 'yyyy-MM-dd');
  const defaultFromDate = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  
  const [fromDate, setFromDate] = useState<string>(defaultFromDate);
  const [toDate, setToDate] = useState<string>(defaultToDate);

  const fetchSessionHistory = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await sessionsApi.getSessionHistory(userId, fromDate, toDate);
      setSessions(response.sessions || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке истории сессий';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId, fromDate, toDate]);

  useEffect(() => {
    fetchSessionHistory();
  }, [fetchSessionHistory]);

  const setDateRange = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
  };

  return {
    sessions,
    isLoading,
    error,
    fromDate,
    toDate,
    setDateRange,
    refetch: fetchSessionHistory,
  };
};

