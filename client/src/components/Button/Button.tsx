import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils';
import { buttonVariants } from './buttonVariants';
import { Loader } from 'lucide-react';

// Automatically generate the types based on the CVA configuration
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {/* 2. Replace the span with the Lucide icon */}
        {isLoading && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
