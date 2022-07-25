import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppRoutePath } from '../../app-route-path.enum';
import { GreaseCalculationPath } from '../../features/grease-calculation/grease-calculation-path.enum';
import { getParameterValidity } from '../store/selectors/calculation-parameters/calculation-parameters.selector';
import { CalculationResultGuard } from './calculation-result.guard';

describe('CalculationResultGuard', () => {
  let spectator: SpectatorService<CalculationResultGuard>;
  let guard: CalculationResultGuard;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationResultGuard,
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
    guard = spectator.inject(CalculationResultGuard);
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
