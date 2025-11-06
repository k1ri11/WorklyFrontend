import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../../features/auth';
import { useAuth } from '../../hooks/useAuth';
import { Spinner } from '../../components/ui';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workly</h1>
          <p className="text-gray-600">Система трекинга вовлечённости сотрудников</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Вход в систему</h2>
          <LoginForm />
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Для доступа к системе используйте учетные данные, <br />
          предоставленные администратором.
        </p>
      </div>
    </div>
  );
};

