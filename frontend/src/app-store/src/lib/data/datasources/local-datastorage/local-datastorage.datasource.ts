import { Inject, Injectable } from '@angular/core';
import { UserLocalStorage } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageDatasource {
  private readonly USER_PREFIX = 'user';
  private readonly AUTHZ_PREFIX = 'authz';

  public getUser(): UserLocalStorage | null {
    const lastUserId = localStorage.getItem(`${this.USER_PREFIX}.lastUserId`);

    if (!lastUserId) return null;

    const data = localStorage.getItem(`${this.USER_PREFIX}.${lastUserId}`);

    return data ? (JSON.parse(data) as UserLocalStorage) : null;
  }

  public getAuthz(): any | null {
    const data = localStorage.getItem(this.AUTHZ_PREFIX);
    return data ? JSON.parse(data) : null;
  }

  public clearAuthz(): void {
    localStorage.removeItem(this.AUTHZ_PREFIX);
  }
}
