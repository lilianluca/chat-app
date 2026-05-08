import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Inbox } from '@/features/chats/types';
import { cn } from '@/utils';
import { Users } from 'lucide-react';
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
      to={`/chats/${data.id}`}
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
          {data.isGroup ? <Users className='size-4' /> : data.displayInfo.shortName}
        </AvatarFallback>
      </Avatar>

      <div className='flex-1'>
        <div className='flex items-center gap-1'>
          <h3 className='text-base font-medium'>{data.displayInfo.name}</h3>
          <p>{data.displayInfo.statusEmoji}</p>
        </div>
        <p className='text-sm text-muted-foreground'>
          {data.isGroup && data.latestMessage ? (
            <span className='font-medium text-foreground/70'>
              {data.latestMessage.sender.firstName}:
            </span>
          ) : null}{' '}
          {data.latestMessage?.text || 'No messages yet'}
        </p>
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
