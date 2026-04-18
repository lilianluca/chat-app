import { ChatCard } from '@/features/chats/components';

export const ChatCardList = () => {
  // Display a fixed list of 40 chat cards for now, until we have the backend set up
  const chatCards = Array.from({ length: 40 }, (_, i) => <ChatCard key={i} />);
  return <div className='flex flex-col gap-1'>{chatCards}</div>;
};
