import { axiosInstance, ENDPOINTS } from '../../../api';
import { DepartmentDTO, DepartmentListResponse, DepartmentUsersResponse, DepartmentUsersRequest, UpdateDepartmentRequest } from '../../../types';

interface DepartmentFilters {
  page?: number;
  page_size?: number;
  manager_id?: number;
  search?: string;
}

export const listDepartments = async (filters?: DepartmentFilters): Promise<DepartmentListResponse> => {
  const response = await axiosInstance.get<DepartmentListResponse>(ENDPOINTS.DEPARTMENTS.LIST, {
    params: filters,
  });
  return response.data;
};

export const getDepartmentById = async (id: number): Promise<DepartmentDTO> => {
  const response = await axiosInstance.get<DepartmentDTO>(ENDPOINTS.DEPARTMENTS.BY_ID(id));
  return response.data;
};

export const updateDepartment = async (id: number, data: UpdateDepartmentRequest): Promise<DepartmentDTO> => {
  const response = await axiosInstance.put<DepartmentDTO>(ENDPOINTS.DEPARTMENTS.BY_ID(id), data);
  return response.data;
};

export const getDepartmentUsers = async (id: number): Promise<DepartmentUsersResponse> => {
  const response = await axiosInstance.get<DepartmentUsersResponse>(ENDPOINTS.DEPARTMENTS.USERS(id));
  return response.data;
};

export const updateDepartmentUsers = async (id: number, data: DepartmentUsersRequest): Promise<DepartmentUsersResponse> => {
  const response = await axiosInstance.put<DepartmentUsersResponse>(ENDPOINTS.DEPARTMENTS.USERS(id), data);
  return response.data;
};

