import { axiosInstance, ENDPOINTS } from '../../../api';
import { SessionDTO, SuccessResponse } from '../../../types';

export const startSession = async (): Promise<SuccessResponse> => {
  const response = await axiosInstance.post<SuccessResponse>(ENDPOINTS.SESSIONS.START);
  return response.data;
};

export const pauseSession = async (sessionId: number, reason?: string): Promise<SuccessResponse> => {
  const response = await axiosInstance.post<SuccessResponse>(ENDPOINTS.SESSIONS.PAUSE, {
    session_id: sessionId,
    reason,
  });
  return response.data;
};

export const resumeSession = async (sessionId: number): Promise<SessionDTO> => {
  const response = await axiosInstance.post<SessionDTO>(ENDPOINTS.SESSIONS.RESUME, {
    session_id: sessionId,
  });
  return response.data;
};

export const endSession = async (sessionId: number): Promise<SessionDTO> => {
  const response = await axiosInstance.post<SessionDTO>(ENDPOINTS.SESSIONS.END, {
    session_id: sessionId,
  });
  return response.data;
};

export const getTodaySession = async (userId: number): Promise<SessionDTO> => {
  const response = await axiosInstance.get<SessionDTO>(ENDPOINTS.SESSIONS.TODAY(userId));
  return response.data;
};

