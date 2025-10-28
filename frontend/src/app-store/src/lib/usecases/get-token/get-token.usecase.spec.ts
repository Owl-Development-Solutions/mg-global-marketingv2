import { TestBed } from '@angular/core/testing';

import { GetTokenUsecase } from './get-token.usecase';

describe('GetTokenUsecase', () => {
  let service: GetTokenUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetTokenUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
