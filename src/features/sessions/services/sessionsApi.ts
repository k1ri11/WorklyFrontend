import { axiosInstance, ENDPOINTS } from '../../../api';
import { SessionDTO, BreakDTO, SuccessResponse } from '../../../types';

export const startSession = async (): Promise<SessionDTO> => {
  const response = await axiosInstance.post<SessionDTO>(ENDPOINTS.SESSIONS.START);
  return response.data;
};

export const pauseSession = async (sessionId: number, reason?: string): Promise<BreakDTO> => {
  const response = await axiosInstance.post<BreakDTO>(ENDPOINTS.SESSIONS.PAUSE, {
    session_id: sessionId,
    reason,
  });
  return response.data;
};

export const resumeSession = async (sessionId: number): Promise<SuccessResponse> => {
  const response = await axiosInstance.post<SuccessResponse>(ENDPOINTS.SESSIONS.RESUME, {
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

