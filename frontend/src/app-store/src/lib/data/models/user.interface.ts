import { Observable } from 'rxjs';
import { UserResponseModel } from './user.attributes.model';

export interface UserDatasourceInterface {
  getUser(token: string): Observable<UserResponseModel>;
  getUserById(userId: string): Observable<UserResponseModel>;
  searchUserName(userName: string): Observable<string>;
}
