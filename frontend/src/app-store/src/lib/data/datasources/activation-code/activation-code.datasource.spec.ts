import { TestBed } from '@angular/core/testing';

import { ActivationCodeDatasource } from './activation-code.datasource';

describe('ActivationCodeDatasource', () => {
  let service: ActivationCodeDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivationCodeDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
