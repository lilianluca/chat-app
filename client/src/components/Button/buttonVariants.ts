import { cva } from 'class-variance-authority';

// Define the variants using CVA
export const buttonVariants = cva(
  // The base styles applied to ALL buttons
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white hover:bg-brand/90 shadow-sm',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'border border-slate-300 bg-transparent hover:bg-slate-100 text-slate-900',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-900',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 shadow-sm',
      },
      size: {
        sm: 'h-8 px-3 text-xs rounded-md',
        default: 'h-10 px-4 py-2 rounded-md',
        lg: 'h-12 px-8 text-base rounded-md',
        icon: 'h-10 w-10 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);
