import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppRoutePath } from '../../app-route-path.enum';
import { GreaseCalculationPath } from '../../features/grease-calculation/grease-calculation-path.enum';
import { getModelCreationSuccess } from '../store/selectors/bearing-selection/bearing-selection.selector';
import { CalculationParametersGuard } from './calculation-parameters.guard';

describe('CalculationParametersGuard', () => {
  let spectator: SpectatorService<CalculationParametersGuard>;
  let guard: CalculationParametersGuard;
  let store: MockStore;

  const createService = createServiceFactory({
    service: CalculationParametersGuard,
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
    guard = spectator.inject(CalculationParametersGuard);
    store = spectator.inject(MockStore);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    it('should grant access, if there is a bearing in the store', () => {
      store.overrideSelector(getModelCreationSuccess, true);

      guard
        .canActivate(mockRoute)
        .subscribe((granted) => expect(granted).toBeTruthy());
    });

    it('should not grant access, if there is a bearing in the query params', () => {
      guard['router'].navigate = jest.fn();

      store.overrideSelector(getModelCreationSuccess, false);

      const emptyMockRoute = {
        ...mockRoute,
        queryParams: {},
      } as unknown as ActivatedRouteSnapshot;

      guard.canActivate(emptyMockRoute).subscribe((granted) => {
        expect(guard['router'].navigate).toHaveBeenCalledWith([
          `${AppRoutePath.GreaseCalculationPath}/${GreaseCalculationPath.BearingPath}`,
        ]);
        expect(granted).toBeFalsy();
      });
    });
  });
});
