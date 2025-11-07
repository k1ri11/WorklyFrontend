import { axiosInstance, ENDPOINTS } from '../../../api';
import { SessionHistoryResponse } from '../../../types';

export const getSessionHistory = async (
  userId: number,
  from: string,
  to: string
): Promise<SessionHistoryResponse> => {
  const response = await axiosInstance.get<SessionHistoryResponse>(
    ENDPOINTS.SESSIONS.HISTORY(userId),
    {
      params: { from, to },
    }
  );
  return response.data;
};

