import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';
import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { RestService } from '../../../services/rest/rest.service';
import { getSelectedBearing } from '../../selectors';
import {
  bearingSearchSuccess,
  searchBearing,
  selectBearing,
  updateRouteParams,
} from './../../actions/bearing/bearing.actions';
import { BearingEffects } from './bearing.effects';

describe('Bearing Effects', () => {
  let action: any;
  let actions$: any;
  let effects: BearingEffects;
  let spectator: SpectatorService<BearingEffects>;
  let restService: RestService;
  let router: Router;
  let route: ActivatedRoute;
  let store: MockStore;

  const createService = createServiceFactory({
    service: BearingEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          getBearingSearch: jest.fn(),
        },
      },
      provideMockStore({}),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(BearingEffects);
    restService = spectator.inject(RestService);
    router = spectator.inject(Router);
    route = spectator.inject(ActivatedRoute);
    store = spectator.inject(MockStore);

    router.navigate = jest.fn();
  });

  describe('bearingSearch$', () => {
    it(
      'should fetch the bearing list',
      marbles((m) => {
        action = searchBearing({ query: 'the query' });

        actions$ = m.hot('-a', { a: action });

        const resultList = ['bearing', 'bear', 'ring', 'ringbear'];

        const response = m.cold('-a|', { a: resultList });
        restService.getBearingSearch = jest.fn(() => response);

        const result = bearingSearchSuccess({ resultList });
        const expected = m.cold('--b', { b: result });

        m.expect(effects.bearingSearch$).toBeObservable(expected);
        m.flush();

        expect(restService.getBearingSearch).toHaveBeenCalledWith('the query');
      })
    );
  });

  describe('bearingSelected$', () => {
    it(
      'should dispatch updateRouteParams',
      marbles((m) => {
        action = selectBearing({ bearing: 'some bearing' });

        actions$ = m.hot('-a', { a: action });

        const result = updateRouteParams();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.bearingSelected$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('updateRouteParams$', () => {
    it('should add route parameters if bearing is set', () => {
      store.overrideSelector(getSelectedBearing, 'bearing');
      action = updateRouteParams();

      actions$ = of(action);

      effects.updateRouteParams$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([], {
        relativeTo: route,
        queryParams: { bearing: 'bearing' },
        queryParamsHandling: 'merge',
      });
    });
    it('should do nothing if no bearing is set', () => {
      store.overrideSelector(getSelectedBearing, undefined);
      action = updateRouteParams();

      actions$ = of(action);

      effects.updateRouteParams$.subscribe();

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
