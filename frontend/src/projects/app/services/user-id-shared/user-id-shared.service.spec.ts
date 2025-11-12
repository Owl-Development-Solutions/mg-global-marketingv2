import { TestBed } from '@angular/core/testing';

import { UsernameSharedService } from './user-id-shared.service';

describe('UsernameSharedService', () => {
  let service: UsernameSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsernameSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
