import { Zap } from 'lucide-react';
import { cn } from '@/utils';

export interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo = ({ className, showText = true }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* 1. Define the invisible SVG gradient */}
      <svg width='0' height='0' className='absolute'>
        <defs>
          <linearGradient id='aurora-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
            <stop offset='0%' stopColor='var(--color-brand, #355070)' />
            <stop offset='50%' stopColor='#B56576' />
            <stop offset='100%' stopColor='#E88C7D' />
          </linearGradient>
        </defs>
      </svg>

      {/* 2. The Icon Wrapper */}
      <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-900/5'>
        <Zap
          className='h-6 w-6'
          strokeWidth={2.5}
          // Point the stroke to our custom gradient ID
          style={{ stroke: 'url(#aurora-gradient)' }}
        />
      </div>

      {/* 3. The Brand Text (Optional, so you can hide it on mobile navs) */}
      {showText && (
        <div className='flex flex-col justify-center'>
          <span className='text-xl font-bold leading-none tracking-tight text-slate-900'>
            Aurora
          </span>
          <span className='text-[10px] font-semibold uppercase tracking-wider text-slate-500'>
            Systems
          </span>
        </div>
      )}
    </div>
  );
};
