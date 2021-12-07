import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { CALCULATION_RESULT_MOCK_ID } from '../../../../../testing/mocks/rest.service.mock';
import { RestService } from '../../../services/rest/rest.service';
import {
  calculationSuccess,
  getCalculation,
} from '../../actions/result/result.actions';
import { ResultEffects } from './result.effects';

describe('Bearing Effects', () => {
  let action: any;
  let actions$: any;
  let effects: ResultEffects;
  let spectator: SpectatorService<ResultEffects>;
  let restService: RestService;
  let router: Router;
  let store: MockStore;

  const mockUrl = '/grease-calculation/result';

  const createService = createServiceFactory({
    service: ResultEffects,
    imports: [RouterTestingModule],
    providers: [
      provideMockActions(() => actions$),
      {
        provide: RestService,
        useValue: {
          postGreaseCalculation: jest.fn(),
        },
      },
      provideMockStore(),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(ResultEffects);
    restService = spectator.inject(RestService);
    router = spectator.inject(Router);
    store = spectator.inject(MockStore);

    router.navigate = jest.fn();
  });

  describe('router$', () => {
    it(
      'should dispatch getCalculation',
      marbles((m) => {
        store.dispatch = jest.fn();
        actions$ = m.hot('-a', {
          a: {
            type: ROUTER_NAVIGATED,
            payload: { routerState: { url: mockUrl } },
          },
        });

        const result = getCalculation();
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
      })
    );
  });

  describe('calculation$', () => {
    it(
      'should fetch grease calculation',
      marbles((m) => {
        const resultId = CALCULATION_RESULT_MOCK_ID;
        const result = calculationSuccess({ resultId });

        action = getCalculation();

        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: resultId });

        const expected = m.cold('--b', { b: result });

        restService.getGreaseCalculation = jest.fn(() => response);

        m.expect(effects.calculation$).toBeObservable(expected);
        m.flush();

        expect(restService.getGreaseCalculation).toHaveBeenCalled();
      })
    );
  });
});
