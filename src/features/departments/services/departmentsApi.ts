import { axiosInstance, ENDPOINTS } from '../../../api';
import { DepartmentDTO, DepartmentListResponse } from '../../../types';

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

