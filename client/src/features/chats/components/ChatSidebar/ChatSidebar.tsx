import { useState } from 'react';
import { Outlet } from 'react-router';
import { ProfileSheet } from '@/features/users/components';
import { NewChatDialog } from './NewChatDialog';
import { ChatCardList } from './ChatCardList';
import { Header } from './Header';

export const ChatSidebar = () => {
  const [isProfileSheetOpen, setProfileSheetOpen] = useState(false);

  return (
    <div className='h-screen overflow-hidden flex'>
      <div className='h-full w-80 md:w-96 flex flex-col gap-2 p-2 border-r'>
        <Header setProfileSheetOpen={setProfileSheetOpen} />
        <ChatCardList />
        <NewChatDialog />
      </div>

      <div className='h-full flex-1 flex flex-col relative'>
        <Outlet />
      </div>

      <ProfileSheet isOpen={isProfileSheetOpen} onOpenChange={setProfileSheetOpen} />
    </div>
  );
};
