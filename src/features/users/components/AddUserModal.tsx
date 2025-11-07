import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../../../components/ui';
import { useDepartments } from '../hooks/useDepartments';
import { CreateUserRequest } from '../../../types';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}) => {
  const { departments, isLoading: isLoadingDepartments } = useDepartments();
  const [formData, setFormData] = useState<Omit<CreateUserRequest, 'department_id'> & { department_id?: number }>({
    name: '',
    email: '',
    password: '',
    department_id: undefined,
    role_id: 2,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserRequest, string>>>({});

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        department_id: undefined,
        role_id: 2,
      } as Omit<CreateUserRequest, 'department_id'> & { department_id?: number });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateUserRequest, string>> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!formData.email) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (!formData.department_id) {
      newErrors.department_id = 'Отдел обязателен';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof CreateUserRequest, value: string | number | undefined) => {
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

    if (!formData.department_id) {
      return;
    }

    await onSave({
      ...formData,
      department_id: formData.department_id,
    });
  };

  const departmentOptions = departments
    .filter((dept) => dept.id !== undefined && dept.name !== undefined)
    .map((dept) => ({
      value: dept.id!,
      label: dept.name!,
    }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Добавить сотрудника"
      size="md"
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
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
                placeholder="Иван Иванов"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
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
                placeholder="user@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">
              <LockClosedIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <Input
                id="password"
                type="password"
                label="Пароль"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={errors.password}
                placeholder="Минимум 6 символов"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-start gap-3">
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
                error={errors.department_id}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
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
    </Modal>
  );
};

