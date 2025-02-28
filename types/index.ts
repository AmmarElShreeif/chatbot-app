// Types for database
export type Message = {
  id: string;
  user_id: string;
  content: string;
  is_user: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
  updated_at: string;
};

export type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export type AuthContextType = {
  user: User | null;
  setAuth: (token: string) => void;
  setUserData: (user: User) => void;
};
type User = {
  $id: string;
  name: string;
  email: string;
  avatar: string;
};
