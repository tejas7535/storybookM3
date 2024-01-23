import { fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject } from 'rxjs';

import { ProductSelectionFacade, SettingsFacade } from '@ea/core/store';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BearingDesignationProvidedGuard } from './bearing-designation-provided.guard';

describe('BearingDesignationProvidedGuard', () => {
  let spectator: SpectatorService<BearingDesignationProvidedGuard>;
  let guard: BearingDesignationProvidedGuard;
  let router: Router;
  const standaloneChanges$ = new BehaviorSubject<boolean>(true);
  const standalone$ = standaloneChanges$.asObservable();
  const bearingDesignationChanges$ = new BehaviorSubject<string>('modelId-123');
  const bearingDesignation$ = bearingDesignationChanges$.asObservable();

  const createService = createServiceFactory({
    service: BearingDesignationProvidedGuard,
    imports: [RouterTestingModule],
    providers: [
      {
        provide: ProductSelectionFacade,
        useValue: {
          bearingDesignation$,
        },
      },
      {
        provide: SettingsFacade,
        useValue: {
          isStandalone$: standalone$,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(BearingDesignationProvidedGuard);
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  it('should be created', () => {
    expect(spectator).toBeTruthy();
  });

  describe('canActivate', () => {
    const bearing = 'mock-bearing';
    const mockRoute: ActivatedRouteSnapshot = {
      queryParams: {
        bearing,
      },
    } as unknown as ActivatedRouteSnapshot;
    describe('when bearing designation is provided', () => {
      it('should grant access', fakeAsync(() => {
        let result;
        guard.canActivate(mockRoute).subscribe((granted) => (result = granted));
        tick();
        expect(result).toBeTruthy();
      }));
    });

    describe('when bearing designation is not provided', () => {
      beforeAll(() => {
        bearingDesignationChanges$.next(undefined);
      });
      describe('when app is embedded', () => {
        beforeAll(() => {
          standaloneChanges$.next(false);
        });
        it('should grant access', fakeAsync(() => {
          let result;
          guard
            .canActivate(mockRoute)
            .subscribe((granted) => (result = granted));
          tick();
          expect(result).toBeTruthy();
        }));
      });

      describe('when app is standalone', () => {
        beforeAll(() => {
          standaloneChanges$.next(true);
        });
        it('should not grant access', fakeAsync(() => {
          let result;
          guard
            .canActivate(mockRoute)
            .subscribe((granted) => (result = granted));
          tick();
          expect(result).toBeFalsy();
          expect(router.navigate).toHaveBeenCalledWith(['home'], {
            queryParams: { bearing },
          });
        }));
      });
    });
  });
});
