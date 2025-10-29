import { inject, Injectable } from '@angular/core';
import { UserRepositoryInterface } from '../../../domain/repository';
import { Observable } from 'rxjs';
import { UserResponseModel } from '../../models/user.attributes.model';
import { UserDatasource } from '../../datasources/user/user-datasource';

@Injectable({
  providedIn: 'root',
})
export class UserRepository implements UserRepositoryInterface {
  private userDatasource = inject(UserDatasource);

  getUser(token?: string): Observable<UserResponseModel> {
    return this.userDatasource.getUser(token);
  }
  getUserById(userId?: string): Observable<UserResponseModel> {
    return this.userDatasource.getUserById(userId);
  }

  searchUserName(userName: string): Observable<string> {
    return this.userDatasource.searchUserName(userName);
  }
}
