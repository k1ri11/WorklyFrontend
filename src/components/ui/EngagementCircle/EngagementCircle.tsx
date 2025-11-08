import React from 'react';

interface EngagementCircleProps {
  engagement: number; // 0-1
  size?: number;
  strokeWidth?: number;
}

export const EngagementCircle: React.FC<EngagementCircleProps> = ({
  engagement,
  size = 40,
  strokeWidth = 4,
}) => {
  const percentage = Math.min(Math.max(engagement * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (percent: number) => {
    if (percent >= 80) return '#10b981'; // green
    if (percent >= 60) return '#3b82f6'; // blue
    if (percent >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(percentage)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <span className="absolute text-xs font-semibold text-gray-700">
        {Math.round(percentage)}%
      </span>

    </div>
  );
};

