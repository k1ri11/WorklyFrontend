import React from 'react';
import clsx from 'clsx';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  error?: string;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  error,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col sm:flex-row gap-4', className)}>
      <div className="flex-1">
        <label className="label">От</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromChange(e.target.value)}
          max={toDate}
          className={clsx('input', error && 'input-error')}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
      
      <div className="flex-1">
        <label className="label">До</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => onToChange(e.target.value)}
          min={fromDate}
          className={clsx('input', error && 'input-error')}
        />
      </div>
    </div>
  );
};

