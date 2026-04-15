import { cva } from 'class-variance-authority';

// Define input variants using CVA
export const inputVariants = cva(
  // Base styles
  'flex w-full text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        outline:
          'rounded-md border border-slate-300 bg-white focus:border-transparent focus:ring-2 focus:ring-brand',
        filled:
          'rounded-md border-transparent bg-slate-100 focus:bg-white focus:ring-2 focus:ring-brand',
        flushed: 'border-b-2 border-slate-300 bg-transparent px-0 focus:border-brand rounded-none', // Great for minimal search bars
      },
      inputSize: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-3 py-2 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'outline',
      inputSize: 'default',
    },
  },
);
