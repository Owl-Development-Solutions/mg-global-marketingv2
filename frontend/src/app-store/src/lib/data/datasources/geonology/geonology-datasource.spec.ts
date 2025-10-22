import { TestBed } from '@angular/core/testing';

import { GeonologyDatasource } from './geonology-datasource';
describe('GeonologyDatasource', () => {
  let service: GeonologyDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeonologyDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
