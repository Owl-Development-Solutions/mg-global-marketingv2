import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsernameSharedService {
  usernameSponsor$ = new BehaviorSubject<string>('');
  usernameUpline$ = new BehaviorSubject<string>('');

  usernameSponsorValue$ = this.usernameSponsor$.asObservable();
  usernameUplineValue$ = this.usernameSponsor$.asObservable();

  getUserSponsorUsername(username: string) {
    this.usernameSponsor$.next(username);
  }

  getUserUplineUsername(username: string) {
    this.usernameUpline$.next(username);
  }
}
