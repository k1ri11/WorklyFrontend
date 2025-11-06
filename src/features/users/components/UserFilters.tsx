import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input, Select } from '../../../components/ui';
import { DepartmentDTO } from '../../../types';

interface UserFiltersProps {
  onSearchChange: (search: string) => void;
  onDepartmentChange: (departmentId: number | string) => void;
  departments: DepartmentDTO[];
  isLoadingDepartments: boolean;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  onSearchChange,
  onDepartmentChange,
  departments,
  isLoadingDepartments,
}) => {
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange(searchValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, onSearchChange]);

  const departmentOptions = departments
    .filter((dept) => dept.id !== undefined && dept.name !== undefined)
    .map((dept) => ({
      value: dept.id!,
      label: dept.name!,
    }));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Поиск по имени или email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          options={departmentOptions}
          onChange={onDepartmentChange}
          placeholder="Все отделы"
          disabled={isLoadingDepartments}
        />
      </div>
    </div>
  );
};

