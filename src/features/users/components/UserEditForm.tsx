import React, { useState, useEffect } from 'react';
import { UserDTO, UpdateUserRequest } from '../../../types';
import { Card, Input, Select, Button } from '../../../components/ui';
import { useDepartments } from '../hooks/useDepartments';
import { usePositions } from '../../../features/positions';
import {
  UserIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

interface UserEditFormProps {
  user: UserDTO;
  onSave: (data: UpdateUserRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserEditForm: React.FC<UserEditFormProps> = ({
  user,
  onSave,
  onCancel,
  isLoading = false,
}) => {
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  const { positions, isLoading: isLoadingPositions } = usePositions();
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: user.name || '',
    email: user.email || '',
    department_id: undefined,
    position_id: undefined,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserRequest, string>>>({});

  useEffect(() => {
    if (user.department && departments.length > 0) {
      const department = departments.find((d) => d.name === user.department);
      if (department?.id) {
        setFormData((prev) => ({ ...prev, department_id: department.id }));
      }
    }
  }, [user.department, departments]);

  useEffect(() => {
    if (user.position && positions.length > 0) {
      const position = positions.find((p) => p.title === user.position);
      if (position?.id) {
        setFormData((prev) => ({ ...prev, position_id: position.id }));
      }
    }
  }, [user.position, positions]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateUserRequest, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
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

  const departmentOptions = departments
    .filter((dept) => dept.id !== undefined && dept.name !== undefined)
    .map((dept) => ({
      value: dept.id!,
      label: dept.name!,
    }));

  const positionOptions = positions
    .filter((pos) => pos.id !== undefined && pos.title !== undefined)
    .map((pos) => ({
      value: pos.id!,
      label: pos.title!,
    }));

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
              <EnvelopeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <Input
                id="email"
                type="email"
                label="Email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <BuildingOfficeIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <Select
                id="department_id"
                label="Отдел"
                options={departmentOptions}
                value={formData.department_id || ''}
                onChange={(value) => handleChange('department_id', value === '' ? undefined : Number(value))}
                placeholder="Выберите отдел"
                disabled={isLoading || isLoadingDepartments}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <BriefcaseIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <Select
                id="position_id"
                label="Должность"
                options={positionOptions}
                value={formData.position_id || ''}
                onChange={(value) => handleChange('position_id', value === '' ? undefined : Number(value))}
                placeholder="Выберите должность"
                disabled={isLoading || isLoadingPositions}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 py-3">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Роль</p>
              <p className="text-base text-gray-500">{user.role || 'Не указана'}</p>
              <p className="text-xs text-gray-400 mt-1">Редактирование роли временно недоступно</p>
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

