import { AuthUserResponse, User } from './auth-user-profile-attributes.model';

export interface UserResponseModel extends AuthUserResponse {
  id: string;
  type: string;
  attributes: User;
}
