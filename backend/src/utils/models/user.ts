export interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  name: string;
  email: string;
  password: string;
  address: string;
  country: string;
  city: string;
  contact_number: string;
  role: string;
  refresh_token: string;
  created_at: Date;
  update_at: Date;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface UserResponse extends AuthResponse {
  id: string;
  type: string;
  attributes: User;
}

export interface JWTProps {
  id: string;
  email: string;
}
