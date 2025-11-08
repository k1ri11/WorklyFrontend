import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartmentsList } from '../../features/departments';
import { Card, Pagination, Spinner, Input } from '../../components/ui';
import { BuildingOfficeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const DepartmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { departments, total, totalPages, currentPage, isLoading, error } = useDepartmentsList({
    page,
    page_size: pageSize,
    search: search || undefined,
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDepartmentClick = (departmentId: number) => {
    navigate(`/departments/${departmentId}`);
  };

  if (isLoading && departments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Отделы</h1>
          <p className="text-gray-600">Список всех отделов компании</p>
        </div>

        <Card className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Поиск по названию отдела..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </Card>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {departments.length === 0 && !isLoading ? (
          <Card>
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Отделы не найдены</p>
              <p className="text-sm text-gray-500">
                {search ? 'Попробуйте изменить параметры поиска' : 'В системе пока нет отделов'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {departments.map((department) => (
              <Card
                key={department.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => department.id && handleDepartmentClick(department.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    </div>
                  </div>
                </div>

                {department.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{department.description}</p>
                )}

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  {department.manager_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Руководитель:</span>
                      <span>{department.manager_name}</span>
                    </div>
                  )}
                  {department.users_count !== undefined && (
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium mr-2">Сотрудников:</span>
                      <span>{department.users_count}</span>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

