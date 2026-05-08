import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

import { useSearchUsersQuery } from '@/features/users/hooks';
import { useCreateConversationMutation } from '@/features/chats/hooks';
import { useDebounce } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
  onSuccess: () => void;
}

export const CreateDirectMessage = ({ onSuccess }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: searchResults, isLoading, isFetching } = useSearchUsersQuery(debouncedSearch);
  const createConversationMutation = useCreateConversationMutation();

  // Instant creation when a user is clicked!
  const handleSelectUser = (userId: number) => {
    createConversationMutation.mutate(
      {
        participantIds: [userId],
      },
      {
        onSuccess: (data) => {
          onSuccess();
          queryClient.removeQueries({ queryKey: ['users', 'search'] });
          navigate(`/chats/${data.id}`);
        },
        onError: (error) => {
          console.error('Failed to create DM:', error);
        },
      },
    );
  };

  return (
    <div className='flex flex-col h-full'>
      <Command shouldFilter={false} className='px-3 pt-2'>
        <div className='relative'>
          <CommandInput
            placeholder='Search by name or email...'
            value={search}
            onValueChange={setSearch}
            disabled={createConversationMutation.isPending} // Prevent typing while creating
          />

          {isFetching && (
            <div className='absolute right-3 top-3'>
              <Loader2 className='size-4 animate-spin text-muted-foreground' />
            </div>
          )}
        </div>

        <CommandList className='max-h-80'>
          {isLoading && (
            <CommandGroup>
              {[1, 2, 3].map((i) => (
                <div key={i} className='flex items-center gap-3 p-2'>
                  <Skeleton className='w-8 h-8 rounded-full' />
                  <div className='flex flex-col gap-1'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                </div>
              ))}
            </CommandGroup>
          )}

          {!isLoading && searchResults?.length === 0 && <CommandEmpty>No users found</CommandEmpty>}

          <CommandGroup>
            {searchResults?.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id.toString()}
                onSelect={() => handleSelectUser(user.id)}
                disabled={createConversationMutation.isPending} // Prevent double clicks
                className='cursor-pointer'
              >
                <Avatar>
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className='bg-primary text-primary-foreground'>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col flex-1'>
                  <span className='text-sm font-medium'>
                    {user.firstName} {user.lastName} {user.statusEmoji}
                  </span>
                  <span className='text-xs text-muted-foreground'>{user.email}</span>
                </div>

                {/* Optional: Show a spinner on the specific user being clicked */}
                {createConversationMutation.isPending &&
                  createConversationMutation.variables?.participantIds.includes(user.id) && (
                    <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                  )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};
