import { Observable } from 'rxjs';
import {
  AuthUserResponse,
  RegisterData,
} from './auth-user-profile-attributes.model';
import { UserResponseModel } from './user.attributes.model';

export interface AuthProfileInterface {
  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<UserResponseModel>;
  refreshToken(refreshToken: string): Observable<AuthUserResponse>;
  registerUser(data: RegisterData): Observable<string>;
}
