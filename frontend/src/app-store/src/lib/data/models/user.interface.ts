import { Observable } from 'rxjs';
import { UserResponseModel } from './user.attributes.model';
import { UserData } from './auth-user-profile-attributes.model';

export interface UserDatasourceInterface {
  getUser(token: string): Observable<UserResponseModel>;
  getUserById(userId: string): Observable<UserResponseModel>;
  searchUserName(userName: string): Observable<string>;
  userNameExist(username: string): Observable<UserData[]>;
  searchUserByName(name: string): Observable<UserData[]>;
}
