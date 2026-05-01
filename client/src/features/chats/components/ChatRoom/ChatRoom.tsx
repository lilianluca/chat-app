import { useEffect, useLayoutEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { useParams } from 'react-router';
import { useChatSocket, ReadyState } from '../../hooks/useChatSocket';
import { useMe } from '@/features/users/hooks';
import { cn } from '@/utils';
import { useMessagesQuery } from '@/features/chats/hooks';
import { useInView } from 'react-intersection-observer';

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('default', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export const ChatRoom = () => {
  const { chatId } = useParams();
  const socketurl = `ws://localhost:8000/ws/chat/${chatId}/`;

  const currentUserQuery = useMe();

  const [newMessage, setNewMessage] = useState('');
  // Track scroll height for the anti-jump trick
  const scrollHeightSnap = useRef<number>(0);
  const isInitialMount = useRef(true);

  const { ref: topBoundaryRef, inView } = useInView({
    threshold: 0,
  });

  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: paginatedMessages,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessagesQuery(Number(chatId));

  const historyMessages = useMemo(() => {
    if (!paginatedMessages) return [];
    // Flatten pages and reverse to show oldest at top
    return paginatedMessages.pages.flatMap((page) => page.results).reverse();
  }, [paginatedMessages]);

  const { liveMessages, sendJsonMessage, readyState } = useChatSocket(socketurl);
  useEffect(() => console.log('Live messages:', liveMessages), [liveMessages]);

  // Separate streams, merged for render
  const allMessages = [...historyMessages, ...liveMessages];

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Online',
    [ReadyState.CLOSING]: 'Disconnecting...',
    [ReadyState.CLOSED]: 'Offline',
  }[readyState];

  function handleSendMessage(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    sendJsonMessage({ text: newMessage });
    setNewMessage('');
  }

  function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior });
    }
  }

  // Fetch next page when the top boundary comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      if (scrollContainerRef.current) {
        // Mutate the ref directly (does not trigger a re-render!)
        scrollHeightSnap.current = scrollContainerRef.current.scrollHeight;
      }
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // On initial mount, scroll to bottom immediately (no animation)
  useLayoutEffect(() => {
    if (!isLoading && isInitialMount.current) {
      scrollToBottom('auto');
      isInitialMount.current = false;
    }
  });

  // The Anti-Jump Scroll Restoration
  useLayoutEffect(() => {
    // Check the ref value
    if (scrollHeightSnap.current > 0 && scrollContainerRef.current) {
      const newScrollHeight = scrollContainerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - scrollHeightSnap.current;

      // Push the scrollbar down by the exact height of the newly injected messages
      scrollContainerRef.current.scrollTop += heightDifference;

      // Reset snapshot silently
      scrollHeightSnap.current = 0;
    }
  }, [historyMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (!isInitialMount.current) {
      scrollToBottom('smooth');
    }
  }, [liveMessages]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading messages.</div>;

  return (
    <div className='flex flex-col h-full border rounded-lg'>
      <div className='flex items-center justify-between p-2 border-b bg-muted/50'>
        <h2 className='font-semibold'>Chat Room {chatId}</h2>
        <span className='text-xs text-muted-foreground'>Status: {connectionStatus}</span>
      </div>

      <div ref={scrollContainerRef} className='flex-1 overflow-y-auto'>
        <div className='p-4 w-full max-w-xl mx-auto space-y-4'>
          {/* Top Boundary trigger */}
          <div ref={topBoundaryRef} className='h-4 w-full flex items-center justify-center'>
            {isFetchingNextPage && (
              <span className='text-xs text-muted-foreground animate-pulse'>
                Loading older messages...
              </span>
            )}
          </div>

          {allMessages.map((msg) => {
            const isCurrentUser = currentUserQuery.data?.id === msg.sender.id;

            return (
              <div
                key={msg.id}
                className={cn('flex flex-col', {
                  'items-end': isCurrentUser,
                  'items-start': !isCurrentUser,
                })}
              >
                <div
                  className={cn('flex items-baseline gap-2 mb-1 px-1', {
                    'flex-row-reverse': isCurrentUser, // Puts the time on the left of "You"
                  })}
                >
                  <span className='text-xs font-medium text-muted-foreground'>
                    {isCurrentUser ? 'You' : `${msg.sender.firstName} ${msg.sender.lastName}`}
                  </span>

                  {/* The Timestamp */}
                  <span className='text-[10px] text-muted-foreground/70'>
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
                <div
                  className={cn(
                    'p-3 rounded-2xl w-fit max-w-[85%] md:max-w-[75%] wrap-break-word',
                    {
                      'bg-primary text-primary-foreground rounded-tr-sm': isCurrentUser,
                      'bg-muted text-foreground rounded-tl-sm': !isCurrentUser,
                    },
                  )}
                >
                  <p className='text-sm'>{msg.text}</p>
                </div>
              </div>
            );
          })}

          {/* Scroll anchor */}
          <div ref={messageEndRef} />
        </div>
      </div>

      <form onSubmit={handleSendMessage} className='p-2 md:p-4 border-t flex gap-2 bg-background'>
        <input
          type='text'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='flex-1 px-3 py-2 border rounded-md'
          placeholder='Type a message...'
          disabled={readyState !== ReadyState.OPEN}
        />
        <button
          type='submit'
          disabled={readyState !== ReadyState.OPEN}
          className='px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50'
        >
          Send
        </button>
      </form>
    </div>
  );
};
