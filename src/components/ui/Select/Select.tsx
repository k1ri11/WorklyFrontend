import React from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  containerClassName?: string;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  onChange,
  containerClassName,
  className,
  placeholder,
  value,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val === '' ? '' : val);
  };

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        className={clsx(
          'input',
          error && 'input-error',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

