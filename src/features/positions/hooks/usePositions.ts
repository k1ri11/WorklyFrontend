import { useState, useEffect } from 'react';
import { listPositions } from '../services/positionsApi';
import { PositionDTO } from '../../../types';

interface UsePositionsResult {
  positions: PositionDTO[];
  isLoading: boolean;
  error: string | null;
}

export const usePositions = (): UsePositionsResult => {
  const [positions, setPositions] = useState<PositionDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await listPositions();
        setPositions(response.positions || []);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Ошибка при загрузке должностей');
        setPositions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositions();
  }, []);

  return { positions, isLoading, error };
};

