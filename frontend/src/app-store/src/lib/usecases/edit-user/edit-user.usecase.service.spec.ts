import { TestBed } from '@angular/core/testing';

import { EditUserUsecaseService } from './edit-user.usecase.service';

describe('EditUserUsecaseService', () => {
  let service: EditUserUsecaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditUserUsecaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
