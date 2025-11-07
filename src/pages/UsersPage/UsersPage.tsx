import React, { useState, useCallback } from 'react';
import { useUsers, useDepartments } from '../../features/users';
import { UserCard, UserFilters, DeleteUserModal } from '../../features/users';
import { Pagination, Spinner } from '../../components/ui';
import { UserDTO, UserFilters as IUserFilters } from '../../types';
import { UserCircleIcon } from '@heroicons/react/24/outline';

export const UsersPage: React.FC = () => {
  const [filters, setFilters] = useState<IUserFilters>({
    page: 1,
    page_size: 20,
    search: '',
    department_id: undefined,
  });

  const { users, total, totalPages, currentPage, isLoading, error, refetch, deleteUser } = useUsers(filters);
  const { departments, isLoading: isLoadingDepartments } = useDepartments();

  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const handleDepartmentChange = useCallback((departmentId: number | string) => {
    setFilters((prev) => ({
      ...prev,
      department_id: departmentId === '' ? undefined : Number(departmentId),
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleDeleteClick = (user: UserDTO) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (userId: number) => {
    await deleteUser(userId);
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  if (isLoading && users.length === 0) {
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Список сотрудников</h1>
          <p className="text-gray-600">
            Всего сотрудников: <span className="font-medium">{total}</span>
          </p>
        </div>

        <div className="mb-6">
          <UserFilters
            onSearchChange={handleSearchChange}
            onDepartmentChange={handleDepartmentChange}
            departments={departments}
            isLoadingDepartments={isLoadingDepartments}
            searchValue={filters.search}
            selectedDepartmentId={filters.department_id}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">
              <span className="font-medium">Ошибка:</span> {error}
            </p>
            <button
              onClick={refetch}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium underline"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {isLoading && users.length > 0 && (
          <div className="mb-6 flex justify-center">
            <Spinner size="md" />
          </div>
        )}

        {!isLoading && users.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Сотрудники не найдены
              </h3>
              <p className="text-gray-600 mb-4">
                {filters.search || filters.department_id
                  ? 'Попробуйте изменить параметры поиска или фильтры'
                  : 'В системе пока нет зарегистрированных сотрудников'}
              </p>
              {(filters.search || filters.department_id) && (
                <button
                  onClick={() => setFilters({ page: 1, page_size: 20 })}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          </div>
        )}

        {users.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>

      <DeleteUserModal
        user={selectedUser}
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

