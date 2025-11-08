import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDepartment, useDepartmentUsers } from '../../features/departments';
import { useUsers } from '../../features/users';
import * as departmentsApi from '../../features/departments/services/departmentsApi';
import { Card, Spinner, Button, Input, Modal } from '../../components/ui';
import { BuildingOfficeIcon, ArrowLeftIcon, UserIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { UpdateDepartmentRequest } from '../../types';

export const DepartmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { department, isLoading, error, refetch: refetchDepartment } = useDepartment(id);
  const { users: departmentUsers, isLoading: isLoadingUsers, refetch: refetchUsers } = useDepartmentUsers(id);
  
  // Мемоизируем фильтры, чтобы избежать бесконечных запросов
  const userFilters = useMemo(() => ({ page: 1, page_size: 100 }), []);
  const { users: allUsers } = useUsers(userFilters);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [usersToAdd, setUsersToAdd] = useState<number[]>([]);

  const [formData, setFormData] = useState<UpdateDepartmentRequest>({
    name: '',
    description: '',
    manager_id: undefined,
  });

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        manager_id: undefined, // Нужно будет получить manager_id из API или через поиск
      });
    }
  }, [department]);

  useEffect(() => {
    setSelectedUserIds(departmentUsers.map(u => u.id!).filter(Boolean) as number[]);
  }, [departmentUsers]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    if (department) {
      setFormData({
        name: department.name || '',
        description: department.description || '',
        manager_id: undefined,
      });
    }
  };

  const handleSave = async () => {
    if (!id || !department) return;

    setIsSaving(true);
    try {
      await departmentsApi.updateDepartment(Number(id), formData);
      toast.success('Отдел успешно обновлен');
      setIsEditMode(false);
      refetchDepartment();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при обновлении отдела';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!id) return;

    const newUserIds = selectedUserIds.filter(id => id !== userId);
    
    try {
      await departmentsApi.updateDepartmentUsers(Number(id), { user_ids: newUserIds });
      toast.success('Сотрудник удален из отдела');
      setSelectedUserIds(newUserIds);
      refetchUsers();
      refetchDepartment();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при удалении сотрудника';
      toast.error(errorMessage);
    }
  };

  const handleAddUsers = async () => {
    if (!id) return;

    // Объединяем текущих пользователей отдела с новыми
    const currentUserIds = departmentUsers.map(u => u.id!).filter(Boolean) as number[];
    const newUserIds = [...currentUserIds, ...usersToAdd];

    try {
      await departmentsApi.updateDepartmentUsers(Number(id), { user_ids: newUserIds });
      toast.success('Сотрудники успешно добавлены в отдел');
      setShowAddUserModal(false);
      setUsersToAdd([]);
      refetchUsers();
      refetchDepartment();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при добавлении сотрудников';
      toast.error(errorMessage);
    }
  };

  const handleUserToggle = (userId: number) => {
    setUsersToAdd(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleOpenAddModal = () => {
    setUsersToAdd([]);
    setShowAddUserModal(true);
  };

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

  const availableUsers = allUsers.filter(user => !selectedUserIds.includes(user.id!));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="secondary"
            onClick={() => navigate('/departments')}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Назад к списку отделов
          </Button>
          
          {!isEditMode && (
            <Button
              variant="primary"
              onClick={handleEdit}
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              Редактировать
            </Button>
          )}
        </div>

        <Card className="mb-6">
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-8 h-8 text-primary-600" />
              </div>
              <div className="flex-1">
                {isEditMode ? (
                  <Input
                    label="Название отдела"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Название отдела"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">{department.name}</h1>
                )}
              </div>
            </div>

            {isEditMode ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Описание отдела"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                  >
                    Сохранить
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </Card>

        {/* Список сотрудников */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Сотрудники отдела</h2>
            {isEditMode && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleOpenAddModal}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Добавить сотрудников
              </Button>
            )}
          </div>

          {isLoadingUsers ? (
            <div className="py-8 text-center">
              <Spinner size="md" />
            </div>
          ) : departmentUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">В отделе пока нет сотрудников</p>
              {isEditMode && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenAddModal}
                >
                  Добавить сотрудников
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {departmentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.email && (
                        <p className="text-sm text-gray-600">{user.email}</p>
                      )}
                    </div>
                  </div>
                  {isEditMode && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => user.id && handleDeleteUser(user.id)}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Модальное окно добавления сотрудников */}
        <Modal
          isOpen={showAddUserModal}
          onClose={() => setShowAddUserModal(false)}
          title="Добавить сотрудников в отдел"
          size="lg"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Выберите сотрудников для добавления в отдел
            </p>
            
            {availableUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                Все доступные сотрудники уже добавлены в отдел
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {availableUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={usersToAdd.includes(user.id!)}
                      onChange={() => user.id && handleUserToggle(user.id)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {user.email && (
                        <p className="text-sm text-gray-600">{user.email}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex space-x-3 pt-4 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={handleAddUsers}
                className="flex-1"
                disabled={usersToAdd.length === 0}
              >
                Добавить выбранных ({usersToAdd.length})
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowAddUserModal(false)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
