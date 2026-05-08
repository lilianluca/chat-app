import { useSearchUsersQuery } from '@/features/users/hooks';
import type { SearchUser } from '@/features/users/types';
import { useDebounce } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCreateConversationMutation } from '@/features/chats/hooks';
import { Loader2, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { CreateConversationPayload } from '@/features/chats/types';

interface Props {
  onSuccess: () => void;
}

export const CreateGroupChat = ({ onSuccess }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [groupName, setGroupName] = useState('');

  const [selectedUsers, setSelectedUsers] = useState<SearchUser[]>([]);

  const { data: searchResults, isLoading, isFetching } = useSearchUsersQuery(debouncedSearch);
  const createConversationMutation = useCreateConversationMutation();

  function toggleUser(user: SearchUser) {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id); // Remove them
      }
      return [...prev, user]; // Add them
    });
    setSearch('');
  }

  async function handleCreateGroup() {
    const payload: CreateConversationPayload = {
      isGroup: true,
      name: groupName,
      participantIds: selectedUsers.map((user) => user.id),
    };

    createConversationMutation.mutate(payload, {
      onSuccess: (data) => {
        onSuccess();
        setGroupName('');
        setSelectedUsers([]);
        queryClient.removeQueries({ queryKey: ['users', 'search'] });
        navigate(`/chats/${data.id}`);
      },
    });
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='my-2 px-4'>
        <Input
          type='text'
          placeholder='Group Name'
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>

      <Command shouldFilter={false} className='px-3'>
        {selectedUsers.length > 0 && (
          <div className='flex flex-wrap gap-2 py-3'>
            {selectedUsers.map((user) => (
              <Badge key={`badge-${user.id}`} variant='secondary' className='px-1.5 py-0.5'>
                <Avatar className='w-4 h-4 mr-1.5'>
                  <AvatarImage src={user.avatar || ''} />
                  <AvatarFallback className='text-[8px]'>{user.firstName?.[0]}</AvatarFallback>
                </Avatar>
                {user.firstName}
                <button
                  onClick={() => toggleUser(user)}
                  className='ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5'
                >
                  <X className='w-3 h-3' />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className='relative'>
          <CommandInput
            placeholder='Search by name or email...'
            value={search}
            onValueChange={setSearch}
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
            {searchResults?.map((user) => {
              const isSelected = selectedUsers.some((u) => u.id === user.id);

              if (isSelected) return null;

              return (
                <CommandItem
                  key={user.id}
                  value={user.id.toString()}
                  onSelect={() => toggleUser(user)}
                >
                  <Avatar>
                    <AvatarImage src={user.avatar || ''} />
                    <AvatarFallback className='bg-primary text-primary-foreground'>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>
                      {user.firstName} {user.lastName} {user.statusEmoji}
                    </span>
                    <span className='text-xs text-muted-foreground'>{user.email}</span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>

      <div className='px-4 my-1'>
        <Button
          className='w-full'
          disabled={
            selectedUsers.length === 0 || !groupName.trim() || createConversationMutation.isPending
          }
          onClick={handleCreateGroup}
        >
          {createConversationMutation.isPending && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Create Group ({selectedUsers.length})
        </Button>
      </div>
    </div>
  );
};
