import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '../Button';

export type ConfirmDialogType = 'warning' | 'danger' | 'info' | 'success';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: ConfirmDialogType;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const iconConfig = {
  warning: {
    Icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  danger: {
    Icon: ExclamationTriangleIcon,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  info: {
    Icon: InformationCircleIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  success: {
    Icon: CheckCircleIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Подтвердить',
  cancelText = 'Отменить',
  isLoading = false,
}) => {
  const config = iconConfig[type];
  const Icon = config.Icon;

  const getConfirmButtonVariant = () => {
    if (type === 'danger') return 'danger';
    return 'primary';
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 rounded-full p-3 ${config.bgColor}`}>
                      <Icon className={`w-6 h-6 ${config.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                      </Dialog.Title>
                      <Dialog.Description className="text-sm text-gray-600">
                        {message}
                      </Dialog.Description>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 justify-end">
                    <Button
                      variant="secondary"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      {cancelText}
                    </Button>
                    <Button
                      variant={getConfirmButtonVariant()}
                      onClick={onConfirm}
                      isLoading={isLoading}
                    >
                      {confirmText}
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

