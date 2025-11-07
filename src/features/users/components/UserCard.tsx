import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { UserDTO } from '../../../types';
import { Card } from '../../../components/ui';

interface UserCardProps {
  user: UserDTO;
  onDelete: (user: UserDTO) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onDelete }) => {
  return (
    <Card className="relative">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
        
        <div className="space-y-1">
          <p className="text-sm text-gray-600">{user.email}</p>
          
          {user.department && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Отдел:</span> {user.department}
            </p>
          )}
          
          {user.position && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Должность:</span> {user.position}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onDelete(user)}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Удалить"
          title="Удалить"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </Card>
  );
};

