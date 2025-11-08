import { axiosInstance, ENDPOINTS } from '../../../api';
import { DepartmentDetailsResponse, TopPerformersResponse } from '../../../types';

interface DepartmentDetailsParams {
  departmentId: number;
  from: string;
  to: string;
}

interface TopEngagementsParams {
  limit?: number;
  order?: 'asc' | 'desc';
  departmentId?: number;
  from?: string;
  to?: string;
}

export const getDepartmentDetails = async (params: DepartmentDetailsParams): Promise<DepartmentDetailsResponse> => {
  const response = await axiosInstance.get<DepartmentDetailsResponse>(ENDPOINTS.STATISTICS.DEPARTMENT_DETAILS, {
    params: {
      departmentId: params.departmentId,
      from: params.from,
      to: params.to,
    },
  });
  return response.data;
};

export const getTopEngagements = async (params?: TopEngagementsParams): Promise<TopPerformersResponse> => {
  const response = await axiosInstance.get<TopPerformersResponse>(ENDPOINTS.STATISTICS.TOP_ENGAGEMENTS, {
    params: {
      limit: params?.limit,
      order: params?.order,
      departmentId: params?.departmentId,
      from: params?.from,
      to: params?.to,
    },
  });
  return response.data;
};

