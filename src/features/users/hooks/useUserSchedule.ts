import { useState, useEffect, useCallback } from 'react';
import { UserScheduleDTO } from '../../../types';
import * as usersApi from '../services/usersApi';
import toast from 'react-hot-toast';

interface UseUserScheduleResult {
  schedule: UserScheduleDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUserSchedule = (userId: number | undefined): UseUserScheduleResult => {
  const [schedule, setSchedule] = useState<UserScheduleDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const scheduleData = await usersApi.getUserSchedule(userId);
      setSchedule(scheduleData);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSchedule(null);
        setError(null);
      } else {
        const errorMessage = err.response?.data?.error || 'Ошибка при загрузке расписания';
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  return {
    schedule,
    isLoading,
    error,
    refetch: fetchSchedule,
  };
};

