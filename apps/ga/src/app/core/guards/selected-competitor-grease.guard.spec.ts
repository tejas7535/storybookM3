import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { Observable, of } from 'rxjs';

import { AppRoutePath } from '@ga/app-route-path.enum';
import { Grease } from '@ga/shared/services/greases/greases.service';

import { CalculationParametersFacade } from '../store';
import { selectedCompetitorGreaseGuard } from './selected-competitor-grease.guard';

describe('selectedCompetitorGreaseGuard', () => {
  let facade: CalculationParametersFacade;
  let router: Router;
  let routeSnapshot: ActivatedRouteSnapshot;
  let stateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CalculationParametersFacade,
          useValue: { selectedCompetitorGrease$: of(undefined) },
        },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    });
    facade = TestBed.inject(CalculationParametersFacade);
    router = TestBed.inject(Router);
    routeSnapshot = {} as ActivatedRouteSnapshot;
    stateSnapshot = { url: 'test-url' } as RouterStateSnapshot;
    jest.clearAllMocks();
  });

  it('should allow activation if grease is selected', (done) => {
    (facade.selectedCompetitorGrease$ as any) = of({
      id: 'some-id',
      company: 'some-company',
    } as Grease);

    TestBed.runInInjectionContext(() => {
      const result$ = selectedCompetitorGreaseGuard(
        routeSnapshot,
        stateSnapshot
      ) as Observable<boolean>;
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(true);
          done();
        },
        error: done.fail,
        complete: () => {
          throw new Error('No value emitted');
        },
      });
    });
  });

  it('should redirect and block activation if grease is not selected', (done) => {
    (facade.selectedCompetitorGrease$ as any) = of(undefined);

    TestBed.runInInjectionContext(() => {
      const result$ = selectedCompetitorGreaseGuard(
        routeSnapshot,
        stateSnapshot
      ) as Observable<boolean>;
      result$.subscribe({
        next: (result) => {
          expect(router.navigate).toHaveBeenCalledWith([AppRoutePath.BasePath]);
          expect(result).toBe(false);
          done();
        },
        error: done.fail,
        complete: () => {
          throw new Error('No value emitted');
        },
      });
    });
  });
});
