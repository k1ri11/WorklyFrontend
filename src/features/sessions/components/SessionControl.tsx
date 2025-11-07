import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTodaySession } from '../hooks/useTodaySession';
import * as sessionsApi from '../services/sessionsApi';
import { Modal, Button, Input } from '../../../components/ui';
import { ClockIcon, PlayIcon, PauseIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { format, intervalToDuration } from 'date-fns';

export const SessionControl: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const { session, isLoading, refetch } = useTodaySession(userId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [pauseReason, setPauseReason] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

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

  // Обновляем время каждую секунду для активной сессии
  useEffect(() => {
    const hasActiveBreak = session?.breaks?.some((b) => b.is_active) || false;
    const isActive = session?.is_active && !hasActiveBreak;

    if (isActive) {
      // Обновляем сразу при изменении состояния
      setCurrentTime(Date.now());
      
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Обновляем время при изменении сессии, даже если она не активна
      setCurrentTime(Date.now());
    }
  }, [session]);

  // Дополнительно обновляем время при открытии модалки
  useEffect(() => {
    if (isModalOpen) {
      setCurrentTime(Date.now());
    }
  }, [isModalOpen]);

  const getCurrentDuration = (): number => {
    if (!session?.start_time) return 0;
    
    // Если сессия завершена, используем total_duration
    if (!session.is_active && session.total_duration !== null && session.total_duration !== undefined) {
      return session.total_duration;
    }
    
    // Для активной сессии вычисляем текущую длительность
    const now = Math.floor(currentTime / 1000);
    const start = session.start_time;
    const breaksDuration = session.breaks?.reduce((total, breakItem) => {
      if (breakItem.is_active && breakItem.start_time) {
        return total + (now - breakItem.start_time);
      }
      if (breakItem.duration) {
        return total + breakItem.duration;
      }
      return total;
    }, 0) || 0;
    return Math.max(0, now - start - breaksDuration);
  };

  const handleStart = async () => {
    setIsActionLoading(true);
    try {
      await sessionsApi.startSession();
      toast.success('Рабочий день начат');
      setIsModalOpen(false);
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
      toast.success('Пауза начата');
      setPauseReason('');
      refetch();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Ошибка при начале паузы';
      toast.error(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!session?.id) return;

    setIsActionLoading(true);
    try {
      await sessionsApi.resumeSession(session.id);
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
  const isActive = session?.is_active && !hasActiveBreak;
  const currentDuration = getCurrentDuration();

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="Управление рабочим днем"
      >
        <ClockIcon className="w-5 h-5" />
        {session?.is_active && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        )}
      </button>

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
                    {formatDuration(currentDuration)}
                  </span>
                </div>
              </div>
            )}

            {hasActiveBreak && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <span className="font-medium">Пауза активна</span>
                </p>
                {session.breaks?.find((b) => b.is_active)?.reason && (
                  <p className="text-xs text-yellow-700 mt-1">
                    Причина: {session.breaks.find((b) => b.is_active)?.reason}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {isActive ? (
                <>
                  <div>
                    <Input
                      label="Причина паузы (необязательно)"
                      value={pauseReason}
                      onChange={(e) => setPauseReason(e.target.value)}
                      placeholder="Обед, кофе и т.д."
                      disabled={isActionLoading}
                    />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handlePause}
                    isLoading={isActionLoading}
                    className="w-full"
                  >
                    <PauseIcon className="w-5 h-5 mr-2" />
                    Взять паузу
                  </Button>
                </>
              ) : hasActiveBreak ? (
                <Button
                  variant="primary"
                  onClick={handleResume}
                  isLoading={isActionLoading}
                  className="w-full"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Продолжить работу
                </Button>
              ) : null}

              {session.is_active && (
                <Button
                  variant="danger"
                  onClick={handleEnd}
                  isLoading={isActionLoading}
                  className="w-full"
                >
                  <StopIcon className="w-5 h-5 mr-2" />
                  Завершить рабочий день
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

