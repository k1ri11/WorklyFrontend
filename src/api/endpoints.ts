import { API_VERSION } from '../utils/constants';

const API_PREFIX = `/api/${API_VERSION}`;

export const ENDPOINTS = {
  // Health
  HEALTH: '/health',

  // Auth
  AUTH: {
    REGISTER: `${API_PREFIX}/auth/register`,
    LOGIN: `${API_PREFIX}/auth/login`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    ME: `${API_PREFIX}/auth/me`,
  },

  // Users
  USERS: {
    LIST: `${API_PREFIX}/users`,
    BY_ID: (id: number | string) => `${API_PREFIX}/users/${id}`,
    SEARCH: `${API_PREFIX}/users/search`,
    SCHEDULE: (id: number | string) => `${API_PREFIX}/users/${id}/schedule`,
  },

  // Sessions
  SESSIONS: {
    START: `${API_PREFIX}/sessions/start`,
    PAUSE: `${API_PREFIX}/sessions/pause`,
    RESUME: `${API_PREFIX}/sessions/resume`,
    END: `${API_PREFIX}/sessions/end`,
    TODAY: (userId: number | string) => `${API_PREFIX}/sessions/${userId}/today`,
    HISTORY: (userId: number | string) => `${API_PREFIX}/sessions/${userId}/history`,
    STATISTICS: `${API_PREFIX}/sessions/statistics`,
  },

  // Departments
  DEPARTMENTS: {
    LIST: `${API_PREFIX}/departments`,
    BY_ID: (id: number | string) => `${API_PREFIX}/departments/${id}`,
    USERS: (id: number | string) => `${API_PREFIX}/departments/${id}/users`,
  },

  // Positions
  POSITIONS: {
    LIST: `${API_PREFIX}/positions`,
    BY_ID: (id: number | string) => `${API_PREFIX}/positions/${id}`,
  },

  // Statistics
  STATISTICS: {
    ABSENCES: `${API_PREFIX}/statistics/absences`,
    TOP_PERFORMERS: `${API_PREFIX}/statistics/top-performers`,
    AVERAGE_WORKTIME: `${API_PREFIX}/statistics/average-worktime`,
    DEPARTMENT_DETAILS: `${API_PREFIX}/statistics/department-details`,
    TOP_ENGAGEMENTS: `${API_PREFIX}/statistics/top-engagements`,
    DAILY_ENGAGEMENT: `${API_PREFIX}/statistics/daily-engagement`,
  },
} as const;

