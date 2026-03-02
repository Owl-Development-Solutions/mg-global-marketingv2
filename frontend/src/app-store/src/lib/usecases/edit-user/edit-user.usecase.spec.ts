import { TestBed } from '@angular/core/testing';

import { EditUserUsecase } from './edit-user.usecase';

describe('EditUserUsecase', () => {
  let service: EditUserUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditUserUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
