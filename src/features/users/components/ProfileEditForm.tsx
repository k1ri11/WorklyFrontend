import React, { useState } from 'react';
import { UserDTO, UpdateUserRequest } from '../../../types';
import { Card, Input, Button } from '../../../components/ui';
import { UserIcon } from '@heroicons/react/24/outline';

interface ProfileEditFormProps {
  user: UserDTO;
  onSave: (data: UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  user,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: user.name || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserRequest, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof UpdateUserRequest, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSave(formData);
  };

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Основная информация</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <Input
                id="name"
                label="ФИО"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={errors.name}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Email</p>
              <p className="text-base text-gray-500">{user.email || 'Не указан'}</p>
              <p className="text-xs text-gray-400 mt-1">Редактирование email недоступно</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Должность</p>
              <p className="text-base text-gray-500">{user.position || 'Не указана'}</p>
              <p className="text-xs text-gray-400 mt-1">Редактирование должности недоступно</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Роль</p>
              <p className="text-base text-gray-500">{user.role || 'Не указана'}</p>
              <p className="text-xs text-gray-400 mt-1">Редактирование роли недоступно</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Отдел</p>
              <p className="text-base text-gray-500">{user.department || 'Не указан'}</p>
              <p className="text-xs text-gray-400 mt-1">Редактирование отдела недоступно</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Отменить
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </Card>
  );
};

