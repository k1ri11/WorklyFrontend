import { axiosInstance, ENDPOINTS } from '../../../api';
import { DepartmentDetailsResponse, TopPerformersResponse, DailyEngagementResponse } from '../../../types';

interface DepartmentDetailsParams {
  departmentId?: number;
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

interface DailyEngagementParams {
  departmentId?: number;
  from: string;
  to: string;
}

export const getDepartmentDetails = async (params: DepartmentDetailsParams): Promise<DepartmentDetailsResponse> => {
  const response = await axiosInstance.get<DepartmentDetailsResponse>(ENDPOINTS.STATISTICS.DEPARTMENT_DETAILS, {
    params: {
      ...(params.departmentId !== undefined && { departmentId: params.departmentId }),
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

export const getDailyEngagement = async (params: DailyEngagementParams): Promise<DailyEngagementResponse> => {
  const response = await axiosInstance.get<DailyEngagementResponse>(ENDPOINTS.STATISTICS.DAILY_ENGAGEMENT, {
    params: {
      ...(params.departmentId !== undefined && { departmentId: params.departmentId }),
      from: params.from,
      to: params.to,
    },
  });
  return response.data;
};

