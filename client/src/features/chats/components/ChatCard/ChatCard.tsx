import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Inbox } from '@/features/chats/types';
import { cn } from '@/utils';
import { NavLink } from 'react-router';

interface Props {
  data: Inbox;
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export const ChatCard = ({ data }: Props) => {
  return (
    <NavLink
      to={`/chats/${data.latestMessage?.conversation}`}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-4 px-2 py-1 rounded-lg hover:bg-secondary cursor-pointer transition-colors',
          {
            'bg-secondary': isActive,
          },
        )
      }
    >
      <Avatar size='lg'>
        <AvatarImage src={data.displayInfo.avatar || ''} />
        <AvatarFallback className='bg-primary text-primary-foreground'>
          {data.displayInfo.shortName}
        </AvatarFallback>
      </Avatar>

      <div className='flex-1'>
        <div className='flex items-center gap-1'>
          <h3 className='text-sm font-medium'>{data.displayInfo.name}</h3>
          <p>{data.displayInfo.statusEmoji}</p>
        </div>
        <p className='text-sm text-muted-foreground'>{data.latestMessage?.text}</p>
      </div>

      <div className='flex flex-col justify-between items-end gap-1'>
        <p className='text-sm text-muted-foreground'>
          {data.latestMessage
            ? dateTimeFormatter.format(new Date(data.latestMessage.createdAt))
            : ''}
        </p>
        {data.unreadCount > 0 && (
          <div className='bg-primary text-background text-xs font-medium size-6 flex items-center justify-center rounded-full'>
            {data.unreadCount}
          </div>
        )}
      </div>
    </NavLink>
  );
};
