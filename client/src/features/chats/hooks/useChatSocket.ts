import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage, WebSocketReceivePayload } from '@/features/chats/types';

export const ReadyState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

export type ReadyStateValue = (typeof ReadyState)[keyof typeof ReadyState];

export const useChatSocket = (url: string) => {
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [readyState, setReadyState] = useState<ReadyStateValue>(ReadyState.CONNECTING);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(url);
      socketRef.current = ws;
      setReadyState(ReadyState.CONNECTING);

      ws.onopen = () => {
        console.log('✅ WebSocket Connected');
        setReadyState(ReadyState.OPEN);

        // Clear any pending reconnect timers if we successfully connect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketReceivePayload = JSON.parse(event.data);
          if (data.message) {
            setLiveMessages((prev) => [...prev, data.message]);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('❌ WebSocket Disconnected. Reconnecting in 3s...');
        setReadyState(ReadyState.CLOSED);

        // Because 'connect' is a hoisted function, it can safely call itself here!
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        // Ignore errors caused by React Strict Mode instantly unmounting the component
        if (ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) {
          return;
        }

        console.error('WebSocket Error:', error);
        ws.close();
      };
    }

    // Start the initial connection
    connect();

    // Cleanup function when the component unmounts
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
    };
  }, [url]);

  // Helper function to send messages
  const sendJsonMessage = useCallback((payload: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn('Tried to send message, but WebSocket is not open.');
    }
  }, []);

  return {
    liveMessages,
    readyState,
    sendJsonMessage,
  };
};
