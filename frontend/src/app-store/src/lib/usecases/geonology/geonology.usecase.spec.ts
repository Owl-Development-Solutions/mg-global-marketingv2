import { TestBed } from '@angular/core/testing';

import { GeonologyUsecase } from './geonology.usecase';

describe('GeonologyUsecase', () => {
  let service: GeonologyUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeonologyUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
