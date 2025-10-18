import { TestBed } from '@angular/core/testing';

import { AuthDatasource } from './auth-datasource';
describe('AuthDatasourceService', () => {
  let service: AuthDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
