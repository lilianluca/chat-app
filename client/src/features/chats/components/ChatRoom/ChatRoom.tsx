import { useState, type SyntheticEvent } from 'react';
import { useParams } from 'react-router';
import { useChatSocket, ReadyState } from '../../hooks/useChatSocket';

export const ChatRoom = () => {
  const { chatId } = useParams();
  const socketurl = `ws://localhost:8000/ws/chat/${chatId}/`;

  const [newMessage, setNewMessage] = useState('');

  const { messages, sendJsonMessage, readyState } = useChatSocket(socketurl);

  function handleSendMessage(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (newMessage.trim() === '') return;

    sendJsonMessage({ text: newMessage });
    setNewMessage('');
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting...',
    [ReadyState.OPEN]: 'Online',
    [ReadyState.CLOSING]: 'Disconnecting...',
    [ReadyState.CLOSED]: 'Offline',
  }[readyState];

  return (
    <div className='flex flex-col h-full max-w-2xl mx-auto border rounded-lg'>
      <div className='p-4 border-b bg-muted/50'>
        <h2 className='font-semibold'>Chat Room {chatId}</h2>
        <span className='text-xs text-muted-foreground'>Status: {connectionStatus}</span>
      </div>

      <div className='flex-1 p-4 overflow-y-auto space-y-4'>
        {messages.map((msg) => (
          <div key={msg.id} className='flex flex-col'>
            <span className='text-xs font-medium text-muted-foreground mb-1'>
              {msg.sender.firstName} {msg.sender.lastName}
            </span>
            <div className='p-3 rounded-lg bg-primary/10 w-fit'>
              <p className='text-sm'>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className='p-4 border-t flex gap-2'>
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
