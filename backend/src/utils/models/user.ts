export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  name: string;
  email: string;
  password: string;
  address: string;
  country: string;
  city: string;
  contactNumber: string;
  role: string;
  token: string;
  refreshToken: string;
  createdAt: Date;
  updated_at: Date;
  parentId: string;
  leftChildId: string;
  rightChildId: string;
  activationCode: string;
}

export interface AuthResponse {
  accessToken?: string;
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

export interface UserStats {
  userId: string;
  balance: number;
  leftPoints: number;
  rightPoints: number;
  leftDownline: number;
  rightDownline: number;
  rankPoints: number;
  level: any;
  sidePath: string;
  hasDeduction: boolean;
  createdAt: Date;
  updated_at: Date;
}

export type UserData = Pick<User, "id" | "userName">;
