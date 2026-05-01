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
import { Link } from 'react-router';
import { useLogoutMutation } from '@/features/auth/hooks';
import { toast } from 'sonner';

interface Props {
  setProfileSheetOpen: (open: boolean) => void;
}

export const Header = ({ setProfileSheetOpen }: Props) => {
  const logoutMutation = useLogoutMutation();

  function handleLogout(e: Event) {
    e.preventDefault();
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Logged out successfully');
      },
    });
  }

  function handleDropdownClose(e: Event) {
    // If we are currently logging out, don't let clicking away close the menu
    if (logoutMutation.isPending) {
      e.preventDefault();
    }
  }

  function handleOpenProfileSheet() {
    setProfileSheetOpen(true);
  }

  return (
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
            <DropdownMenuItem onSelect={handleOpenProfileSheet}>
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
  );
};
