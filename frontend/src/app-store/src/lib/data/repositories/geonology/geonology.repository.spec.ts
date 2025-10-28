import { TestBed } from '@angular/core/testing';

import { GeonologyRepository } from './geonology.repository';

describe('GeonologyRepository', () => {
  let service: GeonologyRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeonologyRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
