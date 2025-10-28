import { TestBed } from '@angular/core/testing';

import { UserUsecase } from './user.usecase';

describe('UserUsecase', () => {
  let service: UserUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
