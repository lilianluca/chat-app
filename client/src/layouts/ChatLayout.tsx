import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Contact, Loader, LogOut, Menu, MessageCircle, Search, Settings, User } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Link, Outlet } from 'react-router';
import { useLogoutMutation } from '@/features/auth/hooks';

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
    <div className='flex min-h-screen'>
      <div className='flex self-start items-center gap-2 p-2'>
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
              <DropdownMenuItem asChild>
                <Link to='/profile'>
                  <User />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/contacts'>
                  <Contact />
                  <span>Contacts</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to='/settings'>
                  <Settings />
                  <span>Settings</span>
                </Link>
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

        <InputGroup className='max-w-xs'>
          <InputGroupInput placeholder='Search...' />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>12 results</InputGroupAddon>
        </InputGroup>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};
