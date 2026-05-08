import { useState } from 'react';
import { Outlet, useMatch } from 'react-router';
import { ProfileSheet } from '@/features/users/components';
import { NewChatDialog } from './NewChatDialog';
import { ChatCardList } from './ChatCardList';
import { Header } from './Header';
import { cn } from '@/utils';

export const ChatSidebar = () => {
  const [isProfileSheetOpen, setProfileSheetOpen] = useState(false);
  const [search, setSearch] = useState('');
  const isChatSelected = Boolean(useMatch('/chats/:chatId'));

  return (
    <div className='h-screen overflow-hidden flex flex-col md:flex-row'>
      <div
        className={cn(
          'h-full w-full md:w-80 lg:w-96 flex-col gap-2 p-2 border-b md:border-b-0 md:border-r min-h-0',
          {
            'hidden md:flex': isChatSelected,
            flex: !isChatSelected,
          },
        )}
      >
        <Header setProfileSheetOpen={setProfileSheetOpen} search={search} setSearch={setSearch} />
        <ChatCardList search={search} />
        <NewChatDialog />
      </div>

      <div
        className={cn('h-full flex-1 flex-col relative', {
          flex: isChatSelected,
          'hidden md:flex': !isChatSelected,
        })}
      >
        <Outlet />
      </div>

      <ProfileSheet isOpen={isProfileSheetOpen} onOpenChange={setProfileSheetOpen} />
    </div>
  );
};
