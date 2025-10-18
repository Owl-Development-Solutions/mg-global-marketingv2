import { Observable } from 'rxjs';
import { AuthUserResponse } from '../../data/models';

export interface AuthRepositoryInterface {
  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<AuthUserResponse>;
}
