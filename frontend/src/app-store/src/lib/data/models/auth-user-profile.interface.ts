import { Observable } from 'rxjs';
import { AuthUserResponse } from './auth-user-profile-attributes.model';

export interface AuthProfileInterface {
  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<AuthUserResponse>;
}
