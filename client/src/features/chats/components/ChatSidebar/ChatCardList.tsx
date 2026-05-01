import { ChatCard } from './ChatCard';
import { useInboxQuery } from '@/features/chats/hooks';
import { ChatCardSkeleton } from './ChatCardSkeleton';

export const ChatCardList = () => {
  const { data, isLoading, isError } = useInboxQuery();

  const loadingCards = Array.from({ length: 10 }, (_, i) => <ChatCardSkeleton key={i} />);

  if (isError) {
    return <div>Error loading inbox</div>;
  }

  return (
    <div className='flex-1 overflow-y-auto flex flex-col gap-1'>
      {isLoading ? loadingCards : data?.map((inbox) => <ChatCard key={inbox.id} data={inbox} />)}
    </div>
  );
};
