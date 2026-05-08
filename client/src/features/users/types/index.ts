export interface UserProfileResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string;
  statusEmoji: string;
  joinedAt: string;
  updatedAt: string;
}

export interface SearchUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  statusEmoji: string;
}
