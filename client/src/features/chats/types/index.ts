export interface ChatUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Message {
  id: number;
  conversation: number;
  sender: ChatUser;
  text: string;
  createdAt: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: ChatUser;
  createdAt: string;
}

export interface DisplayInfo {
  name: string;
  shortName: string;
  statusEmoji: string;
  avatar?: string;
}

export interface Inbox {
  id: number;
  isGroup: boolean;
  displayInfo: DisplayInfo;
  latestMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface WebSocketReceivePayload {
  message: ChatMessage;
}

export interface SimpleConversation {
  id: number;
  isGroup: boolean;
  name: string;
}

export interface CreateConversationPayload {
  participantIds: number[];
  isGroup?: boolean;
  name?: string;
}
