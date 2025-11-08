import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { BuildingOfficeIcon, UserGroupIcon, ChartBarIcon, ClockIcon, PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useTodaySession } from '../../features/sessions/hooks/useTodaySession';
import { Modal, Button, Input } from '../ui';
import * as sessionsApi from '../../features/sessions/services/sessionsApi';
import toast from 'react-hot-toast';
import { format, intervalToDuration } from 'date-fns';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const userId = user?.id;
  const { session, isLoading, refetch } = useTodaySession(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [sessionBaseTime, setSessionBaseTime] = useState<number>(0);
  const [sessionBaseTimeUpdatedAt, setSessionBaseTimeUpdatedAt] = useState<number | null>(null);
  const [pauseStartTime, setPauseStartTime] = useState<number | null>(null);

  const formatDuration = (seconds: number): string => {
    const duration = intervalToDuration({ start: 0, end: seconds * 1000 });
    const hours = duration.hours || 0;
    const minutes = duration.minutes || 0;
    const secs = duration.seconds || 0;
    if (hours > 0) {
      return `${hours}ч ${minutes}м ${secs}с`;
    }
    return `${minutes}м ${secs}с`;
  };

  useEffect(() => {
    if (session?.current_duration !== null && session?.current_duration !== undefined) {
      setSessionBaseTime(session.current_duration);
      setSessionBaseTimeUpdatedAt(Date.now());
    } else if (session?.is_active && !session?.breaks?.some((b) => b.is_active) && sessionBaseTimeUpdatedAt === null) {
      setSessionBaseTime(0);
      setSessionBaseTimeUpdatedAt(session.start_time ? session.start_time * 1000 : Date.now());
    }
  }, [session?.current_duration, session?.is_active, session?.breaks]);

  useEffect(() => {
    if (session?.is_active && !session?.breaks?.some((b) => b.is_active)) {
      const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
      return () => clearInterval(interval);
    }
  }, [session?.is_active, session?.breaks]);

  useEffect(() => {
    const activeBreak = session?.breaks?.find((b) => b.is_active);
    if (activeBreak) {
      setPauseStartTime(activeBreak.start_time ? activeBreak.start_time * 1000 : Date.now());
      const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
      return () => clearInterval(interval);
    } else {
      setPauseStartTime(null);
    }
  }, [session?.breaks]);

  const getSessionDuration = (): number => {
    if (!session) return 0;
    if (!session.is_active) {
      if (session.end_time && session.start_time) {
        return session.end_time - session.start_time;
      }
      return session.total_duration || 0;
    }
    if (sessionBaseTimeUpdatedAt) {
      const elapsed = Math.floor((currentTime - sessionBaseTimeUpdatedAt) / 1000);
      return sessionBaseTime + elapsed;
    }
    return sessionBaseTime;
  };

  const getPauseDuration = (): number => {
    if (!pauseStartTime) return 0;
    return Math.floor((currentTime - pauseStartTime) / 1000);
  };

  const handleStart = async () => {
    setIsActionLoading(true);
    try {
      await sessionsApi.startSession();
      toast.success('Рабочий день начат');
      refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при начале рабочего дня';
      toast.error(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePause = async () => {
    if (!session?.id) return;
    setIsActionLoading(true);
    try {
      await sessionsApi.pauseSession(session.id, pauseReason || undefined);
      toast.success('Работа приостановлена');
      setPauseReason('');
      refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при приостановке работы';
      toast.error(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!session?.id) return;
    setIsActionLoading(true);
    try {
      const updatedSession = await sessionsApi.resumeSession(session.id);
      if (updatedSession.current_duration !== null && updatedSession.current_duration !== undefined) {
        setSessionBaseTime(updatedSession.current_duration);
        setSessionBaseTimeUpdatedAt(Date.now());
      }
      toast.success('Работа возобновлена');
      refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при возобновлении работы';
      toast.error(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEnd = async () => {
    if (!session?.id) return;
    setIsActionLoading(true);
    try {
      await sessionsApi.endSession(session.id);
      toast.success('Рабочий день завершен');
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при завершении рабочего дня';
      toast.error(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  const hasActiveBreak = session?.breaks?.some((b) => b.is_active) || false;
  const isSessionActive = session?.is_active && !hasActiveBreak;
  const sessionDuration = getSessionDuration();
  const pauseDuration = getPauseDuration();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
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
              
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5" />
                  <span>Дашборд</span>
                </div>
              </Link>
            </nav>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 transition-colors text-sm font-medium"
                aria-label="Управление рабочим днем"
              >
                <ClockIcon className="w-4 h-4" />
                {session?.is_active && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                )}
              </button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Управление рабочим днем"
        size="md"
      >
        {isLoading ? (
          <div className="py-8 text-center text-gray-600">Загрузка...</div>
        ) : !session ? (
          <div className="space-y-4">
            <p className="text-gray-600">Рабочий день еще не начат</p>
            <Button
              variant="primary"
              onClick={handleStart}
              isLoading={isActionLoading}
              className="w-full"
            >
              <PlayIcon className="w-5 h-5 mr-2" />
              Начать рабочий день
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {session.start_time && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Начало работы:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(session.start_time * 1000), 'HH:mm')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Длительность:</span>
                  <span className="text-sm font-medium text-primary-600">
                    {formatDuration(sessionDuration)}
                  </span>
                </div>
                {hasActiveBreak && pauseDuration > 0 && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Длительность паузы:</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {formatDuration(pauseDuration)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {hasActiveBreak && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-800">Активная пауза</span>
                </div>
                {session.breaks?.find((b) => b.is_active)?.reason && (
                  <p className="text-sm text-yellow-700 mb-3">
                    Причина: {session.breaks.find((b) => b.is_active)?.reason}
                  </p>
                )}
                <Button
                  variant="primary"
                  onClick={handleResume}
                  isLoading={isActionLoading}
                  className="w-full"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Возобновить работу
                </Button>
              </div>
            )}

            {session.breaks && session.breaks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">История пауз</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {session.breaks.map((breakItem, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        breakItem.is_active
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {breakItem.start_time &&
                            format(new Date(breakItem.start_time * 1000), 'HH:mm')}
                          {breakItem.end_time &&
                            ` - ${format(new Date(breakItem.end_time * 1000), 'HH:mm')}`}
                        </span>
                        {breakItem.duration && (
                          <span className="text-xs text-gray-600">
                            {formatDuration(breakItem.duration)}
                          </span>
                        )}
                      </div>
                      {breakItem.reason && (
                        <p className="text-xs text-gray-600">{breakItem.reason}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {!hasActiveBreak && (
                <>
                  {isSessionActive ? (
                    <Button
                      variant="secondary"
                      onClick={handlePause}
                      isLoading={isActionLoading}
                      className="w-full"
                    >
                      <PauseIcon className="w-5 h-5 mr-2" />
                      Приостановить работу
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleResume}
                      isLoading={isActionLoading}
                      className="w-full"
                    >
                      <ArrowPathIcon className="w-5 h-5 mr-2" />
                      Возобновить работу
                    </Button>
                  )}
                  {!isSessionActive && (
                    <div className="mb-2">
                      <Input
                        label="Причина паузы"
                        value={pauseReason}
                        onChange={(e) => setPauseReason(e.target.value)}
                        placeholder="Введите причину паузы"
                      />
                    </div>
                  )}
                </>
              )}
              <Button
                variant="danger"
                onClick={handleEnd}
                isLoading={isActionLoading}
                disabled={hasActiveBreak}
                className="w-full"
                title={hasActiveBreak ? 'Сначала завершите активную паузу' : ''}
              >
                <StopIcon className="w-5 h-5 mr-2" />
                Завершить рабочий день
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </header>
  );
};

