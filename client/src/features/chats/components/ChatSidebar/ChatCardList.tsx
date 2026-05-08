import { ChatCard } from './ChatCard';
import { useInboxQuery } from '@/features/chats/hooks';
import { ChatCardSkeleton } from './ChatCardSkeleton';
import { useMemo } from 'react';

interface Props {
  search: string;
}

export const ChatCardList = ({ search }: Props) => {
  const { data, isLoading, isError } = useInboxQuery();

  const filteredInbox = useMemo(() => {
    // If no data, or search is empty, return all inbox items
    if (!data) return [];
    if (!search.trim()) return data;

    const lowerSearch = search.toLowerCase();

    return data.filter((inbox) => {
      const matchesName = inbox.displayInfo.name.toLowerCase().includes(lowerSearch);
      return matchesName;
    });
  }, [data, search]);

  const loadingCards = Array.from({ length: 10 }, (_, i) => <ChatCardSkeleton key={i} />);

  if (isError) {
    return <div>Error loading inbox</div>;
  }

  return (
    <div className='flex-1 overflow-y-auto flex flex-col gap-1'>
      {isLoading
        ? loadingCards
        : filteredInbox.map((inbox) => <ChatCard key={inbox.id} data={inbox} />)}

      {!isLoading && filteredInbox.length === 0 && (
        <div className='p-4 text-center text-sm text-muted-foreground'>
          No chats found for &quot;{search}&quot;
        </div>
      )}
    </div>
  );
};
