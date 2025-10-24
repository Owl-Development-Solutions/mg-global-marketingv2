import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { GetGenealogyGuardFn } from './genealogy.guard';

describe('genealogyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      GetGenealogyGuardFn(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
