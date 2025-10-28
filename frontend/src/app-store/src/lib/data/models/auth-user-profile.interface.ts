import { Observable } from 'rxjs';
import { AuthUserResponse } from './auth-user-profile-attributes.model';
import { UserResponseModel } from './user.attributes.model';

export interface AuthProfileInterface {
  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<AuthUserResponse>;
  refreshToken(refreshToken: string): Observable<AuthUserResponse>;
}
