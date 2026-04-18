import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Loader, LogOut, Menu, MessageCircle, Search, User } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Link, Outlet } from 'react-router';
import { useLogoutMutation } from '@/features/auth/hooks';
import { ChatCardList } from '@/features/chats/components';

export const ChatLayout = () => {
  const logoutMutation = useLogoutMutation();

  function handleLogout(e: Event) {
    e.preventDefault();
    logoutMutation.mutate();
  }

  function handleDropdownClose(e: Event) {
    // If we are currently logging out, don't let clicking away close the menu
    if (logoutMutation.isPending) {
      e.preventDefault();
    }
  }

  return (
    <div className='h-screen overflow-hidden flex'>
      <div className='h-full w-80 md:w-96 flex flex-col gap-2 p-2 border-r'>
        <div className='flex gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline'>
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              onInteractOutside={handleDropdownClose}
              onEscapeKeyDown={handleDropdownClose}
              className='w-40'
              align='start'
            >
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link to='/chats'>
                    <MessageCircle />
                    <span>Chats</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  <span>Notifications</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  variant='destructive'
                  disabled={logoutMutation.isPending}
                  onSelect={handleLogout}
                >
                  {logoutMutation.isPending ? <Loader className='animate-spin' /> : <LogOut />}
                  <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroup>
            <InputGroupInput placeholder='Search...' name='search' />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align='inline-end'>12 results</InputGroupAddon>
          </InputGroup>
        </div>

        <div className='flex-1 overflow-y-auto'>
          <ChatCardList />
        </div>
      </div>

      <div className='h-full flex-1 flex flex-col relative'>
        <Outlet />
      </div>
    </div>
  );
};
