import React, { useState, useMemo } from 'react';
import { format, subDays, parse } from 'date-fns';
import { DateRangePicker } from '../../components/ui/DateRangePicker';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { useDepartmentDetails, useTopEngagements, useDailyEngagement } from '../../features/statistics';
import { useDepartmentsList } from '../../features/departments/hooks/useDepartmentsList';
import { TopPerformerDTO } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const formatHoursAndMinutes = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  return `${h}ч ${m}м`;
};

const formatEngagement = (engagement: number): string => {
  return `${Math.round(engagement * 100)}%`;
};

export const DashboardPage: React.FC = () => {
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  const [fromDate, setFromDate] = useState(format(thirtyDaysAgo, 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(today, 'yyyy-MM-dd'));
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | undefined>(undefined);
  const [engagementOrder, setEngagementOrder] = useState<'asc' | 'desc'>('desc');

  const { departments, isLoading: isLoadingDepartments } = useDepartmentsList({ page_size: 100 });

  const departmentOptions = useMemo(() => {
    return [
      { value: '', label: 'Все отделы' },
      ...(departments || []).map((dept) => ({
        value: dept.id?.toString() || '',
        label: dept.name || 'Без названия',
      })),
    ];
  }, [departments]);

  const departmentDetailsParams = useMemo(
    () => ({
      departmentId: selectedDepartmentId,
      from: fromDate,
      to: toDate,
    }),
    [selectedDepartmentId, fromDate, toDate]
  );

  const { data: departmentDetails, isLoading: isLoadingDetails } = useDepartmentDetails(departmentDetailsParams);

  const topEngagementsParams = useMemo(
    () => ({
      limit: 10,
      order: engagementOrder,
      departmentId: selectedDepartmentId,
      from: fromDate,
      to: toDate,
    }),
    [engagementOrder, selectedDepartmentId, fromDate, toDate]
  );

  const { data: topEngagements, isLoading: isLoadingEngagements } = useTopEngagements(topEngagementsParams);

  const { data: dailyEngagement, isLoading: isLoadingDailyEngagement } = useDailyEngagement({
    departmentId: selectedDepartmentId,
    from: fromDate,
    to: toDate,
  });

  const chartData = useMemo(() => {
    if (!dailyEngagement?.items) return [];
    
    return dailyEngagement.items
      .filter((item) => item.date && item.engagement !== undefined)
      .map((item) => {
        const date = parse(item.date!, 'yyyy-MM-dd', new Date());
        return {
          date: format(date, 'dd.MM'),
          dateValue: date.getTime(),
          engagement: Math.round((item.engagement || 0) * 100),
        };
      })
      .sort((a, b) => a.dateValue - b.dateValue)
      .map(({ dateValue, ...rest }) => rest);
  }, [dailyEngagement]);

  const isLoading = isLoadingDetails || isLoadingEngagements || isLoadingDepartments || isLoadingDailyEngagement;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Дашборд</h1>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <DateRangePicker
          fromDate={fromDate}
          toDate={toDate}
          onFromChange={setFromDate}
          onToChange={setToDate}
        />
        <div className="max-w-md">
          <Select
            label="Отдел"
            value={selectedDepartmentId?.toString() || ''}
            onChange={(value) => setSelectedDepartmentId(value ? Number(value) : undefined)}
            options={departmentOptions}
            placeholder="Выберите отдел"
          />
        </div>
      </div>

      {/* Statistics Cards */}
      {isLoadingDetails ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : departmentDetails ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Количество сотрудников</div>
            <div className="text-2xl font-bold">{departmentDetails.employees_count || 0}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Количество сессий</div>
            <div className="text-2xl font-bold">{departmentDetails.total_sessions || 0}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Среднее время работы</div>
            <div className="text-2xl font-bold">
              {departmentDetails.avg_worktime_hours
                ? formatHoursAndMinutes(departmentDetails.avg_worktime_hours)
                : '0ч 0м'}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Среднее время перерыва</div>
            <div className="text-2xl font-bold">
              {departmentDetails.avg_break_minutes
                ? `${Math.floor(departmentDetails.avg_break_minutes)}м`
                : '0м'}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-600 mb-1">Отклонения от графика</div>
            <div className="text-2xl font-bold">{departmentDetails.schedule_deviations || 0}</div>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Выберите отдел для отображения статистики
        </div>
      )}

      {/* Daily Engagement Chart */}
      {selectedDepartmentId && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">График вовлеченности по дням</h2>
          {isLoadingDailyEngagement ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : chartData.length > 0 ? (
            <Card className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Вовлеченность (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Вовлеченность']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Нет данных для отображения графика
            </div>
          )}
        </div>
      )}

      {/* Top Engagements */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Топ сотрудников по вовлеченности</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setEngagementOrder('desc')}
              className={`px-4 py-2 rounded ${
                engagementOrder === 'desc'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Лучшие
            </button>
            <button
              onClick={() => setEngagementOrder('asc')}
              className={`px-4 py-2 rounded ${
                engagementOrder === 'asc'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Худшие
            </button>
          </div>
        </div>

        {isLoadingEngagements ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : topEngagements?.performers && topEngagements.performers.length > 0 ? (
          <div className="space-y-2">
            {topEngagements.performers.map((performer: TopPerformerDTO, index: number) => (
              <Card key={performer.user_id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-semibold">#{index + 1}</div>
                    <div>
                      <div className="font-medium">{performer.user_name || 'Без имени'}</div>
                      {performer.department_name && (
                        <div className="text-sm text-gray-600">{performer.department_name}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Среднее время работы</div>
                      <div className="font-semibold">
                        {performer.avg_work_time
                          ? formatHoursAndMinutes(performer.avg_work_time)
                          : '0ч 0м'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Вовлеченность</div>
                      <div className="font-semibold">
                        {performer.engagement !== undefined
                          ? formatEngagement(performer.engagement)
                          : '0%'}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Нет данных для отображения
          </div>
        )}
      </div>
    </div>
  );
};

