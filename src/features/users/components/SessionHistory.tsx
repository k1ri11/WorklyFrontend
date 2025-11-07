import React, { useState } from 'react';
import { SessionDTO } from '../../../types';
import { Card, DateRangePicker, Spinner, Button } from '../../../components/ui';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface SessionHistoryProps {
  sessions: SessionDTO[];
  isLoading: boolean;
  error: string | null;
  fromDate: string;
  toDate: string;
  onDateRangeChange: (from: string, to: string) => void;
}

const formatDuration = (seconds: number | null | undefined): string => {
  if (!seconds) return '-';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  return `${minutes}м`;
};

const formatTimestamp = (timestamp: number | null | undefined): string => {
  if (!timestamp) return '-';
  
  try {
    return format(new Date(timestamp * 1000), 'dd.MM.yyyy HH:mm');
  } catch {
    return '-';
  }
};

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  isLoading,
  error,
  fromDate,
  toDate,
  onDateRangeChange,
}) => {
  const [localFromDate, setLocalFromDate] = useState(fromDate);
  const [localToDate, setLocalToDate] = useState(toDate);
  const [dateError, setDateError] = useState<string>('');

  const handleApplyDates = () => {
    if (localFromDate > localToDate) {
      setDateError('Дата начала не может быть позже даты окончания');
      return;
    }

    setDateError('');
    onDateRangeChange(localFromDate, localToDate);
  };

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">История сессий</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Выберите период</span>
          </div>
          
          <DateRangePicker
            fromDate={localFromDate}
            toDate={localToDate}
            onFromChange={setLocalFromDate}
            onToChange={setLocalToDate}
            error={dateError}
          />
          
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={handleApplyDates}>
              Применить
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="md" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Сессии не найдены</p>
          <p className="text-sm text-gray-500">Попробуйте выбрать другой период</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Дата начала</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Дата окончания</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Длительность</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Статус</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatTimestamp(session.start_time)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {session.end_time ? formatTimestamp(session.end_time) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatDuration(session.total_duration)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {session.is_active ? 'Активна' : 'Завершена'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

