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
  
  // Базовое время сессии (current_duration с бэка)
  const [sessionBaseTime, setSessionBaseTime] = useState<number>(0);
  // Время последнего обновления sessionBaseTime (для вычисления прошедшего времени)
  const [sessionBaseTimeUpdatedAt, setSessionBaseTimeUpdatedAt] = useState<number | null>(null);
  // Время начала паузы (для отсчета длительности паузы)
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

  // Инициализация базового времени сессии из current_duration с бэка
  useEffect(() => {
    if (session?.current_duration !== null && session?.current_duration !== undefined) {
      setSessionBaseTime(session.current_duration);
      setSessionBaseTimeUpdatedAt(Date.now());
    } else if (session?.is_active && !session?.breaks?.some((b) => b.is_active) && sessionBaseTimeUpdatedAt === null) {
      // Если сессия активна и нет паузы, но current_duration нет, начинаем с 0
      setSessionBaseTime(0);
      setSessionBaseTimeUpdatedAt(session.start_time ? session.start_time * 1000 : Date.now());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.current_duration, session?.is_active, session?.breaks]);

  // Таймер сессии: запускается при старте, останавливается при паузе
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
  }, [session?.is_active, session?.breaks]);

  // Таймер паузы: запускается при паузе, останавливается при возобновлении
  useEffect(() => {
    const hasActiveBreak = session?.breaks?.some((b) => b.is_active) || false;
    
    if (hasActiveBreak) {
      const activeBreak = session?.breaks?.find((b) => b.is_active);
      const now = Date.now();
      
      if (activeBreak?.start_time) {
        // Устанавливаем время начала паузы из бэка (в миллисекундах)
        const breakStartMs = activeBreak.start_time * 1000;
        // Убеждаемся, что время начала паузы не в будущем
        setPauseStartTime(breakStartMs <= now ? breakStartMs : now);
      } else {
        // Если start_time нет, используем текущее время
        setPauseStartTime(now);
      }
      
      // Обновляем время сразу и затем каждую секунду для отсчета паузы
      setCurrentTime(now);
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);

      return () => clearInterval(interval);
    } else {
      // Сбрасываем таймер паузы при возобновлении работы
      setPauseStartTime(null);
      setCurrentTime(Date.now());
    }
  }, [session?.breaks]);

  // Дополнительно обновляем время при открытии модалки
  useEffect(() => {
    if (isModalOpen) {
      setCurrentTime(Date.now());
    }
  }, [isModalOpen]);

  const getSessionDuration = (): number => {
    if (!session?.start_time) return 0;
    
    // Если сессия завершена
    if (!session.is_active) {
      // Используем total_duration если он есть
      if (session.total_duration !== null && session.total_duration !== undefined && session.total_duration > 0) {
        return session.total_duration;
      }
      // Если total_duration нет, вычисляем от start_time до end_time
      if (session.end_time) {
        return Math.max(0, session.end_time - session.start_time);
      }
      // Если end_time тоже нет, возвращаем 0
      return 0;
    }
    
    const hasActiveBreak = session?.breaks?.some((b) => b.is_active) || false;
    
    // Во время паузы показываем базовое время сессии (без учета текущей паузы)
    if (hasActiveBreak) {
      return sessionBaseTime;
    }
    
    // Для активной сессии: базовое время + время с момента последнего обновления
    if (sessionBaseTimeUpdatedAt && sessionBaseTimeUpdatedAt <= currentTime) {
      const timeSinceLastUpdate = Math.floor((currentTime - sessionBaseTimeUpdatedAt) / 1000);
      return sessionBaseTime + Math.max(0, timeSinceLastUpdate);
    }
    
    // Если sessionBaseTimeUpdatedAt больше currentTime (не должно быть, но на всякий случай)
    if (sessionBaseTimeUpdatedAt && sessionBaseTimeUpdatedAt > currentTime) {
      return sessionBaseTime;
    }
    
    // Если базового времени нет, вычисляем от начала сессии
    const now = Math.floor(currentTime / 1000);
    return Math.max(0, now - session.start_time);
  };

  const getPauseDuration = (): number => {
    if (!pauseStartTime) return 0;
    const duration = Math.floor((currentTime - pauseStartTime) / 1000);
    return Math.max(0, duration);
  };

  const handleStart = async () => {
    setIsActionLoading(true);
    try {
      await sessionsApi.startSession();
      // Сбрасываем базовое время при старте новой сессии
      setSessionBaseTime(0);
      setSessionBaseTimeUpdatedAt(Date.now());
      setPauseStartTime(null);
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
      const updatedSession = await sessionsApi.resumeSession(session.id);
      // Сбрасываем таймер паузы
      setPauseStartTime(null);
      // Обновляем базовое время сессии значением current_duration с бэка
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
  const isActive = session?.is_active && !hasActiveBreak;
  const sessionDuration = getSessionDuration();
  const pauseDuration = getPauseDuration();

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

            {/* Список всех пауз */}
            {session.breaks && session.breaks.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">История пауз</h3>
                {session.breaks
                  .map((breakItem, index) => {
                    const isActive = breakItem.is_active || false;
                    const breakDuration = isActive 
                      ? pauseDuration 
                      : (breakItem.duration || 0);
                    const breakStartTime = breakItem.start_time 
                      ? format(new Date(breakItem.start_time * 1000), 'HH:mm')
                      : '-';
                    const breakEndTime = isActive 
                      ? '...' 
                      : (breakItem.end_time 
                        ? format(new Date(breakItem.end_time * 1000), 'HH:mm')
                        : '-');
                    
                    return (
                      <div 
                        key={breakItem.id || index} 
                        className={`flex items-center justify-between py-2 border-b border-gray-200 last:border-0 ${isActive ? 'bg-yellow-50 rounded px-2 -mx-2' : ''}`}
                      >
                        <div className="flex-1">
                          <div className={`text-sm ${isActive ? 'text-yellow-900 font-medium' : 'text-gray-900'}`}>
                            {breakStartTime} - {breakEndTime}
                            {isActive && <span className="ml-2 text-xs">(активна)</span>}
                          </div>
                          {breakItem.reason && (
                            <div className={`text-xs mt-1 ${isActive ? 'text-yellow-700' : 'text-gray-600'}`}>
                              {breakItem.reason}
                            </div>
                          )}
                        </div>
                        <div className={`text-sm font-medium ${isActive ? 'text-yellow-700' : 'text-gray-700'}`}>
                          {formatDuration(breakDuration)}
                        </div>
                      </div>
                    );
                  })}
                {session.breaks.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">Пауз нет</p>
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
                  disabled={hasActiveBreak}
                  className="w-full"
                  title={hasActiveBreak ? 'Сначала завершите активную паузу' : ''}
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

