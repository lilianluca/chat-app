import { Skeleton } from '@/components/ui/skeleton';

export const ChatCardSkeleton = () => {
  return (
    <div className='flex items-center gap-4 px-2 py-1 rounded-lg hover:bg-secondary cursor-pointer transition-colors'>
      <Skeleton className='size-12 rounded-full' />

      <div className='flex-1'>
        <Skeleton className='w-24 h-4 mb-1' />
        <Skeleton className='w-32 h-3' />
      </div>

      <div className='flex flex-col gap-1'>
        <Skeleton className='w-16 h-3' />
        <Skeleton className='w-6 h-6 rounded-full self-end' />
      </div>
    </div>
  );
};
