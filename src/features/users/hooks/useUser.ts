import { useState, useEffect, useCallback } from 'react';
import { UserDTO } from '../../../types';
import * as usersApi from '../services/usersApi';
import toast from 'react-hot-toast';

interface UseUserResult {
  user: UserDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useUser = (userId: number | undefined): UseUserResult => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userData = await usersApi.getUserById(userId);
      setUser(userData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при загрузке данных сотрудника';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
};

