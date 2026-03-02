import { UserData, UserEditData, UserResponseModel } from '../../data/models';
import { Observable } from 'rxjs';

export interface UserRepositoryInterface {
  getUser(token?: string): Observable<UserResponseModel>;
  getUserById(userId: string): Observable<UserResponseModel>;
  searchUserName(userName: string): Observable<string>;
  userNameExist(username: string): Observable<UserData[]>;
  userNameExist(username: string): Observable<UserData[]>;
  editUser(data: Partial<UserEditData>): Observable<boolean>;
}
