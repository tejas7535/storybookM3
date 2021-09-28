import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppRoutePath } from '../../app-route-path.enum';
import { GreaseCalculationPath } from '../../grease-calculation/grease-calculation-path.enum';
import { getParameterValidity } from '../store/selectors/parameter/parameter.selector';
import { ResultGuard } from './result.guard';

describe('ResultGuard', () => {
  let spectator: SpectatorService<ResultGuard>;
  let guard: ResultGuard;
  let store: MockStore;

  const createService = createServiceFactory({
    service: ResultGuard,
    imports: [RouterTestingModule],
    providers: [provideMockStore({})],
  });

  const mockRoute: ActivatedRouteSnapshot = {
    queryParams: {
      bearing: 'fantasyRouteBearing',
    },
  } as unknown as ActivatedRouteSnapshot;

  beforeEach(() => {
    spectator = createService();
    guard = spectator.inject(ResultGuard);
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should grant access, if the params are valid', () => {
      store.overrideSelector(getParameterValidity, true);

      guard
        .canActivate(mockRoute)
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    it('should not grant access, if the params are not valid', () => {
      guard['router'].navigate = jest.fn();

      store.overrideSelector(getParameterValidity, false);

      guard.canActivate(mockRoute).subscribe((granted) => {
        expect(guard['router'].navigate).toHaveBeenCalledWith(
          [
            `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.ParametersPath}`,
          ],
          { queryParams: { bearing: 'fantasyRouteBearing' } }
        );
        expect(granted).toBeFalsy();
      });
    });
  });
});
