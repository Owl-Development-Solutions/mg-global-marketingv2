import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUserResponse, UserResponseModel } from '../../models';
import { AuthDatasource, LocalStorageDatasource } from '../../datasources';
import { AuthRepositoryInterface } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository implements AuthRepositoryInterface {
  private authDatasource = inject(AuthDatasource);
  private localDatasource = inject(LocalStorageDatasource);

  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<UserResponseModel> {
    return this.authDatasource.initiateAuth(data);
  }

  refreshToken(refreshToken: string): Observable<any> {
    return this.authDatasource.refreshToken(refreshToken);
  }

  //auth-token
}
