import { TestBed } from '@angular/core/testing';

import { PageTitlePortalService } from './page-title-portal.service';

describe('PageTitlePortalService', () => {
  let service: PageTitlePortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageTitlePortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
