import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useUser, useUserSchedule, useSessionHistory } from '../../features/users';
import { UserDetailInfo, ProfileEditForm, UserSchedule, SessionHistory } from '../../features/users';
import * as usersApi from '../../features/users/services/usersApi';
import { Spinner, Button } from '../../components/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { UpdateUserRequest } from '../../types';

export const ProfilePage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const userId = currentUser?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { user, isLoading: isLoadingUser, error: userError, refetch: refetchUser } = useUser(userId);
  const { schedule, isLoading: isLoadingSchedule, error: scheduleError } = useUserSchedule(userId);
  const {
    sessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    fromDate,
    toDate,
    setDateRange,
  } = useSessionHistory(userId);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: UpdateUserRequest) => {
    if (!userId) return;

    setIsSaving(true);
    try {
      await usersApi.updateUser(userId, data);
      toast.success('Данные профиля успешно обновлены');
      setIsEditing(false);
      refetchUser();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при обновлении данных профиля';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки профиля</h2>
              <p className="text-gray-600">
                {userError || 'Не удалось загрузить данные профиля'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEditing ? 'Редактирование профиля' : 'Профиль'}
          </h1>
          
          {!isEditing && (
            <Button variant="primary" onClick={handleEdit}>
              <PencilIcon className="w-5 h-5 mr-2" />
              Редактировать
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {isEditing ? (
            <ProfileEditForm
              user={user}
              onSave={handleSave}
              onCancel={handleCancel}
              isLoading={isSaving}
            />
          ) : (
            <UserDetailInfo user={user} />
          )}

          <UserSchedule schedule={schedule} isLoading={isLoadingSchedule} error={scheduleError} />

          <SessionHistory
            sessions={sessions}
            isLoading={isLoadingSessions}
            error={sessionsError}
            fromDate={fromDate}
            toDate={toDate}
            onDateRangeChange={setDateRange}
          />
        </div>
      </div>
    </div>
  );
};

