import { TestBed } from '@angular/core/testing';

import { AuthUsecase } from './auth.usecase';

describe('AuthService', () => {
  let service: AuthUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
