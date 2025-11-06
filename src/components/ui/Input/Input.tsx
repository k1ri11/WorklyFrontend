import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, containerClassName, className, ...props }, ref) => {
    return (
      <div className={clsx('w-full', containerClassName)}>
        {label && (
          <label className="label" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            error ? 'input-error' : 'input',
            className
          )}
          {...props}
        />
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

