import { TestBed } from '@angular/core/testing';

import { ImageUploadDatasource } from './image-upload-datasource';

describe('ImageUploadDatasource', () => {
  let service: ImageUploadDatasource;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageUploadDatasource);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
