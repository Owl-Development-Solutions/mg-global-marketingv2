import { Injectable, signal } from '@angular/core';

export interface User {
	firstName: string;
	middleName?: string;
	lastName: string;
	birthDate: Date | null;
	username: string;
	email: string;
	sponsor?: any;
	upline?: any;
	position?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
	private _user = signal<User | null>(null);

	constructor() {
		const savedUser = localStorage.getItem('user');
		if (savedUser) {
			this._user.set(JSON.parse(savedUser));
		}
	}

	setUser(user: User) {
		this._user.set(user);
		localStorage.setItem('user', JSON.stringify(user));
	}

	userInfo = this._user.asReadonly();
}
