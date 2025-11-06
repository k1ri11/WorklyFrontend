import { axiosInstance, ENDPOINTS } from '../../../api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserDTO,
} from '../../../types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    ENDPOINTS.AUTH.LOGIN,
    credentials
  );
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    ENDPOINTS.AUTH.REGISTER,
    data
  );
  return response.data;
};

export const logout = async (refreshToken: string): Promise<void> => {
  await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT, {
    refresh_token: refreshToken,
  });
};

export const getCurrentUser = async (): Promise<UserDTO> => {
  const response = await axiosInstance.get<UserDTO>(ENDPOINTS.AUTH.ME);
  return response.data;
};

