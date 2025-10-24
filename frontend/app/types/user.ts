export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}