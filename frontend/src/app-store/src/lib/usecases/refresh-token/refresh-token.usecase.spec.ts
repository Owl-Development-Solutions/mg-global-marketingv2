import { TestBed } from '@angular/core/testing';

import { RefreshTokenUsecase } from './refresh-token.usecase';

describe('RefreshTokenUsecase', () => {
  let service: RefreshTokenUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshTokenUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
