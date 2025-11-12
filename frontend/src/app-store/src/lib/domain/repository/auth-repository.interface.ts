import { Observable } from 'rxjs';
import {
  AuthUserResponse,
  RegisterData,
  UserResponseModel,
} from '../../data/models';

export interface AuthRepositoryInterface {
  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<UserResponseModel>;
  refreshToken(refreshToken: string): Observable<AuthUserResponse>;
  registerUser(data: RegisterData): Observable<string>;
}
