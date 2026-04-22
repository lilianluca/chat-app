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
