import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ChatCard = () => {
  return (
    <div className='flex items-center gap-4 p-1 rounded-lg hover:bg-secondary cursor-pointer transition-colors'>
      <Avatar size='lg'>
        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' className='grayscale' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <div className='flex-1'>
        <h3 className='text-sm font-medium'>Shadcn</h3>
        <p className='text-sm text-muted-foreground'>Hey, how are you?</p>
      </div>

      <div className='flex flex-col gap-1'>
        <p className='text-sm text-muted-foreground'>2:30 PM</p>
        <p className='text-sm bg-primary text-primary-foreground rounded-full size-6 flex items-center justify-center self-end'>
          2
        </p>
      </div>
    </div>
  );
};
