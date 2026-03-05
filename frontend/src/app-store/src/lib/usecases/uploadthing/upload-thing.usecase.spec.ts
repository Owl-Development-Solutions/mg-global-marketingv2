import { TestBed } from '@angular/core/testing';

import { UploadThingUsecase } from './upload-thing.usecase';

describe('UploadThingUsecase', () => {
  let service: UploadThingUsecase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadThingUsecase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
