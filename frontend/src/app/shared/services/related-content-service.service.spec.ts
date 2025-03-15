import { TestBed } from '@angular/core/testing';

import { RelatedContentServiceService } from './related-content-service.service';

describe('RelatedContentServiceService', () => {
  let service: RelatedContentServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelatedContentServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
