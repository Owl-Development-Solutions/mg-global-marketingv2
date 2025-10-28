import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { GetUserByIdGuard } from './get-user-by-id.guard';

describe('GetUserByIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => GetUserByIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
