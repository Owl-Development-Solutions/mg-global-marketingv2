import { AuthUserResponse, User } from './auth-user-profile-attributes.model';

export interface UserResponseModel extends AuthUserResponse {
  id: string;
  type: string;
  attributes: User;
}

export interface UserLocalStorage {
  data: UserResponseModel;
}

export interface UserResponseState {
  loading: boolean;
  loaded: boolean;
  error: null | string;
  data?: UserResponseModel;
}
