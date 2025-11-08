import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BuildingOfficeIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/users" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary-600">Workly</span>
            </Link>
            
            <nav className="flex items-center space-x-1">
              <Link
                to="/users"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/users')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5" />
                  <span>Сотрудники</span>
                </div>
              </Link>
              
              <Link
                to="/departments"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/departments')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BuildingOfficeIcon className="w-5 h-5" />
                  <span>Отделы</span>
                </div>
              </Link>
            </nav>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {user.name}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

