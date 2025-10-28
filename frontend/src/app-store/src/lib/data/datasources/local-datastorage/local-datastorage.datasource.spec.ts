import { TestBed } from '@angular/core/testing';

import { LocalStorageDatasource } from './local-datastorage.datasource';

describe('LocalStorageDatasource', () => {
  let service: LocalStorageDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
