import { axiosInstance, ENDPOINTS } from '../../../api';
import { PositionListResponse } from '../../../types';

export const listPositions = async (): Promise<PositionListResponse> => {
  const response = await axiosInstance.get<PositionListResponse>(ENDPOINTS.POSITIONS.LIST);
  return response.data;
};

