import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepartment } from '../../features/departments';
import { Card, Spinner, Button } from '../../components/ui';
import { BuildingOfficeIcon, ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline';

export const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { department, isLoading, error } = useDepartment(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">{error || 'Отдел не найден'}</p>
            <Button variant="primary" onClick={() => navigate('/departments')}>
              Вернуться к списку отделов
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="secondary"
          onClick={() => navigate('/departments')}
          className="mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Назад к списку отделов
        </Button>

        <Card>
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
              </div>
            </div>

            {department.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Описание</h2>
                <p className="text-gray-700">{department.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {department.manager_name && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Руководитель отдела</p>
                      <p className="text-lg font-semibold text-gray-900">{department.manager_name}</p>
                    </div>
                  </div>
                </div>
              )}

              {department.users_count !== undefined && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Количество сотрудников</p>
                      <p className="text-lg font-semibold text-gray-900">{department.users_count}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

