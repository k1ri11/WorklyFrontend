import { axiosInstance, ENDPOINTS } from '../../../api';
import {
  UserDTO,
  UserListResponse,
  UserFilters,
  CreateUserRequest,
  UpdateUserRequest,
  UserScheduleDTO,
} from '../../../types';

export const listUsers = async (filters?: UserFilters): Promise<UserListResponse> => {
  const response = await axiosInstance.get<UserListResponse>(ENDPOINTS.USERS.LIST, {
    params: filters,
  });
  return response.data;
};

export const getUserById = async (id: number): Promise<UserDTO> => {
  const response = await axiosInstance.get<UserDTO>(ENDPOINTS.USERS.BY_ID(id));
  return response.data;
};

export const createUser = async (data: CreateUserRequest): Promise<UserDTO> => {
  const response = await axiosInstance.post<UserDTO>(ENDPOINTS.USERS.LIST, data);
  return response.data;
};

export const updateUser = async (id: number, data: UpdateUserRequest): Promise<UserDTO> => {
  const response = await axiosInstance.put<UserDTO>(ENDPOINTS.USERS.BY_ID(id), data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(ENDPOINTS.USERS.BY_ID(id));
};

export const searchUsers = async (query: string, limit?: number): Promise<{ users: UserDTO[] }> => {
  const response = await axiosInstance.get<{ users: UserDTO[] }>(ENDPOINTS.USERS.SEARCH, {
    params: { query, limit },
  });
  return response.data;
};

export const getUserSchedule = async (id: number): Promise<UserScheduleDTO> => {
  const response = await axiosInstance.get<UserScheduleDTO>(ENDPOINTS.USERS.SCHEDULE(id));
  return response.data;
};

