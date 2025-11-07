import { useState, useEffect, useCallback } from 'react';
import { SessionDTO } from '../../../types';
import * as sessionsApi from '../services/sessionsApi';
import toast from 'react-hot-toast';

interface UseTodaySessionResult {
  session: SessionDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTodaySession = (userId: number | undefined): UseTodaySessionResult => {
  const [session, setSession] = useState<SessionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sessionData = await sessionsApi.getTodaySession(userId);
      setSession(sessionData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSession(null);
        setError(null);
      } else {
        const errorMessage = err.response?.data?.error || 'Ошибка при загрузке текущей сессии';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    session,
    isLoading,
    error,
    refetch: fetchSession,
  };
};

