import { TestBed } from '@angular/core/testing';

import { ImageUploadRepository } from './image-upload-repository';

describe('ImageUploadRepository', () => {
  let service: ImageUploadRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUploadRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
