import { forwardRef, useId, type InputHTMLAttributes } from 'react';
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
    const generatedId = useId();

    const id = props.id || generatedId; // Use provided id or fallback to generated one

    return (
      <div className='flex w-full flex-col gap-1.5'>
        {label && (
          <label htmlFor={id} className='text-sm font-medium text-slate-700'>
            {label}
          </label>
        )}

        <input
          type={type}
          id={id}
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
