import React from 'react';
import { UserDTO } from '../../../types';
import { Card } from '../../../components/ui';
import {
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface UserDetailInfoProps {
  user: UserDTO;
}

export const UserDetailInfo: React.FC<UserDetailInfoProps> = ({ user }) => {
  const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string | null | undefined }> = ({
    icon,
    label,
    value,
  }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
        <div className="flex-shrink-0 w-5 h-5 text-gray-400 mt-0.5">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="text-base text-gray-900 mt-0.5">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Основная информация</h2>
      </div>
      
      <div className="space-y-0">
        <InfoRow
          icon={<UserIcon className="w-5 h-5" />}
          label="ФИО"
          value={user.name}
        />
        
        <InfoRow
          icon={<EnvelopeIcon className="w-5 h-5" />}
          label="Email"
          value={user.email}
        />
        
        <InfoRow
          icon={<BriefcaseIcon className="w-5 h-5" />}
          label="Должность"
          value={user.position}
        />
        
        <InfoRow
          icon={<ShieldCheckIcon className="w-5 h-5" />}
          label="Роль"
          value={user.role}
        />
        
        <InfoRow
          icon={<BuildingOfficeIcon className="w-5 h-5" />}
          label="Отдел"
          value={user.department}
        />
      </div>
    </Card>
  );
};

