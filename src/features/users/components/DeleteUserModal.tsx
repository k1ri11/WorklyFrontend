import React, { useState } from 'react';
import { ConfirmDialog } from '../../../components/ui';
import { UserDTO } from '../../../types';

interface DeleteUserModalProps {
  user: UserDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: number) => Promise<void>;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      await onConfirm(user.id);
      onClose();
    } catch (error) {
      // Ошибка уже обработана в хуке useUsers
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return null;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Удаление сотрудника"
      message={`Вы уверены, что хотите удалить сотрудника "${user.name}"? Это действие необратимо и удалит все связанные данные (сессии, расписание и т.д.).`}
      type="danger"
      confirmText="Удалить"
      cancelText="Отменить"
      isLoading={isDeleting}
    />
  );
};

