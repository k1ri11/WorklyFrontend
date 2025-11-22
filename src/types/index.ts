import type { components } from './api';

export type UserDTO = components['schemas']['UserDTO'];
export type DepartmentDTO = components['schemas']['DepartmentDTO'];
export type PositionDTO = components['schemas']['PositionDTO'];
export type SessionDTO = components['schemas']['SessionDTO'];
export type BreakDTO = components['schemas']['BreakDTO'];
export type UserScheduleDTO = components['schemas']['UserScheduleDTO'];
export type SessionHistoryResponse = components['schemas']['SessionHistoryResponse'];
export type ErrorResponse = components['schemas']['ErrorResponse'];
export type SuccessResponse = components['schemas']['SuccessResponse'];

export type LoginRequest = components['schemas']['LoginRequest'];
export type LoginResponse = components['schemas']['LoginResponse'];
export type RegisterRequest = components['schemas']['RegisterRequest'];
export type RefreshRequest = components['schemas']['RefreshRequest'];
export type RefreshResponse = components['schemas']['RefreshResponse'];

export type UserListResponse = components['schemas']['UserListResponse'];
export type DepartmentListResponse = components['schemas']['DepartmentListResponse'];
export type PositionListResponse = components['schemas']['PositionListResponse'];
export type DepartmentUsersResponse = components['schemas']['DepartmentUsersResponse'];
export type DepartmentDetailsResponse = components['schemas']['DepartmentDetailsResponse'];
export type TopPerformersResponse = components['schemas']['TopPerformersResponse'];
export type TopPerformerDTO = components['schemas']['TopPerformerDTO'];
export type DailyEngagementResponse = components['schemas']['DailyEngagementResponse'];
export type DailyEngagementItem = components['schemas']['DailyEngagementItem'];

export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
export type UpdateDepartmentRequest = components['schemas']['UpdateDepartmentRequest'];
export type DepartmentUsersRequest = components['schemas']['DepartmentUsersRequest'];

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface UserFilters extends PaginationParams {
  department_id?: number;
  position_id?: number;
  role_id?: number;
  search?: string;
}

