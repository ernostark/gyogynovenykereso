import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { postAccessGuard } from './post-access.guard';

describe('postAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => postAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
