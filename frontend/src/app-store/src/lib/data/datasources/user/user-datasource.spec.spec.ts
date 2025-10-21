import { TestBed } from '@angular/core/testing';

import { UserDatasource } from './user-datasource';

describe('UserDatasource', () => {
  let service: UserDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
