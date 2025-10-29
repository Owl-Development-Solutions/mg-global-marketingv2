import { TestBed } from '@angular/core/testing';

import { ActivationCodeUsecase } from './activation-code.usecase';

describe('ActivationCodeUsecase', () => {
  let service: ActivationCodeUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivationCodeUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
