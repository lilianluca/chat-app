import { forwardRef, type InputHTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { inputVariants } from './inputVariants';

// Omit the native 'size' to avoid conflicts, then add our CVA props
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className='flex w-full flex-col gap-1.5'>
        {label && (
          <label htmlFor={props.id || props.name} className='text-sm font-medium text-slate-700'>
            {label}
          </label>
        )}

        <input
          type={type}
          ref={ref}
          className={cn(
            inputVariants({ variant, inputSize }),
            error && 'border-destructive focus:ring-destructive',
            className,
          )}
          {...props}
        />

        {error && <span className='text-sm text-destructive'>{error}</span>}
      </div>
    );
  },
);

Input.displayName = 'Input';
