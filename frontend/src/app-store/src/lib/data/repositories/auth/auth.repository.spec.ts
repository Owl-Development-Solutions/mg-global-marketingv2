import { TestBed } from '@angular/core/testing';

import { AuthRepository } from './auth.repository';

describe('AuthService', () => {
  let service: AuthRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
