export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}
