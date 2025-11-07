import React from 'react';
import { UserScheduleDTO } from '../../../types';
import { Card, Spinner } from '../../../components/ui';
import { ClockIcon } from '@heroicons/react/24/outline';

interface UserScheduleProps {
  schedule: UserScheduleDTO | null;
  isLoading: boolean;
  error: string | null;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Понедельник' },
  { key: 'tuesday', label: 'Вторник' },
  { key: 'wednesday', label: 'Среда' },
  { key: 'thursday', label: 'Четверг' },
  { key: 'friday', label: 'Пятница' },
  { key: 'saturday', label: 'Суббота' },
  { key: 'sunday', label: 'Воскресенье' },
] as const;

export const UserSchedule: React.FC<UserScheduleProps> = ({ schedule, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Расписание работы</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!schedule) {
    return (
      <Card>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Расписание работы</h2>
        </div>
        <div className="text-center py-8">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Расписание работы не указано</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Расписание работы</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">День недели</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Время работы</th>
            </tr>
          </thead>
          <tbody>
            {DAYS_OF_WEEK.map((day) => {
              const scheduleValue = schedule[day.key as keyof UserScheduleDTO] as string | null | undefined;
              const displayValue = scheduleValue || 'Выходной';

              return (
                <tr key={day.key} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 text-sm font-medium text-gray-700">{day.label}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{displayValue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

