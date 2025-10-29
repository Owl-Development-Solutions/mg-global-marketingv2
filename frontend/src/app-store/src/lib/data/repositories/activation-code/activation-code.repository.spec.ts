import { TestBed } from '@angular/core/testing';

import { ActivationCodeRepository } from './activation-code.repository';

describe('ActivationCodeRepository', () => {
  let service: ActivationCodeRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivationCodeRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
