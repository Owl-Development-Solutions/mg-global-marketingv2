// export interface AuthUserProfileAttributesModel {
//   firstName: string;
// }

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  userName?: string;
  name: string;
  email: string;
  password: string;
  address: string;
  country: string;
  city: string;
  contactNumber: number;
  role: string;
  image?: string;
  birthDate?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface AuthUserResponse {
  accessToken: string;
  refreshToken: string;
}

export type UserData = Pick<User, 'id' | 'userName' | 'name'>;

export interface RegisterData {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  email: string;
  username: string;
  password: string;
  sponsor: string | undefined;
  position: string;
  upline: string | undefined;
  pin: string;
  mainParentId?: string;
}

export interface UserEditData {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  contactNumber: number;
  birthDate: string;
}
