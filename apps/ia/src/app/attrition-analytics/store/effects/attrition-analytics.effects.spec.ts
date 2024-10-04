import { EMPTY } from 'rxjs';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterReducerState } from '@ngrx/router-store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { AppRoutePath } from '../../../app-route-path.enum';
import { RouterStateUrl, selectRouterState } from '../../../core/store';
import { AttritionAnalyticsService } from '../../attrition-analytics.service';
import { loadAvailableClusters } from '../actions/attrition-analytics.action';
import { AttritionAnalyticsEffects } from './attrition-analytics.effects';

describe('Attrition Anayltics Effects', () => {
  let spectator: SpectatorService<AttritionAnalyticsEffects>;
  let actions$: any;
  let action: any;
  let effects: AttritionAnalyticsEffects;
  let store: MockStore;

  const createService = createServiceFactory({
    service: AttritionAnalyticsEffects,
    providers: [
      provideMockActions(() => actions$),
      provideMockStore(),
      {
        provide: AttritionAnalyticsService,
        useValue: {
          getEmployeeAnalytics: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    store = spectator.inject(MockStore);
    effects = spectator.inject(AttritionAnalyticsEffects);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('filterChange$', () => {
    test(
      'should return loadAvailableClusters when url /fluctuation-analytics',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/${AppRoutePath.FluctuationAnalyticsPath}`,
          },
        } as RouterReducerState<RouterStateUrl>);
        action = loadAvailableClusters();
        actions$ = m.hot('-', { a: action });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );

    test(
      'should not return loadAvailableClusters when url different than /fluctuation-analytics',
      marbles((m) => {
        store.overrideSelector(selectRouterState, {
          state: {
            url: `/different-path`,
          },
        } as RouterReducerState<RouterStateUrl>);
        actions$ = m.hot('-', { a: EMPTY });
        const expected = m.cold('-');

        m.expect(effects.filterChange$).toBeObservable(expected);
      })
    );
  });
});
