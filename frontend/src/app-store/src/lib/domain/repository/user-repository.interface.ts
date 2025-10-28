import { UserResponseModel } from '../../data/models';
import { Observable } from 'rxjs';

export interface UserRepositoryInterface {
  getUser(token?: string): Observable<UserResponseModel>;
  getUserById(userId: string): Observable<UserResponseModel>;
}
