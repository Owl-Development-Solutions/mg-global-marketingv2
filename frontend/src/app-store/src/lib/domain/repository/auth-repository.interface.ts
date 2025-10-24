import { Observable } from 'rxjs';
import { AuthUserResponse, UserResponseModel } from '../../data/models';

export interface AuthRepositoryInterface {
  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<AuthUserResponse>;
  refreshToken(refreshToken: string): Observable<AuthUserResponse>;
}
