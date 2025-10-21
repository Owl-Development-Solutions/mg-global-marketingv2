import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthUserResponse } from '../../models';
import { AuthDatasource } from '../../datasources';
import { AuthRepositoryInterface } from '../../../domain';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository implements AuthRepositoryInterface {
  private authDatasource = inject(AuthDatasource);

  initiateAuth(data: {
    email: string;
    password: string;
  }): Observable<AuthUserResponse> {
    return this.authDatasource.initiateAuth(data);
  }

  refreshToken(refreshToken: string): Observable<AuthUserResponse> {
    return this.authDatasource.refreshToken(refreshToken);
  }
}
