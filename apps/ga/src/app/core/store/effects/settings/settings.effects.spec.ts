import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import {
  initSettingsEffects,
  setAppDelivery,
  setCurrentStep,
} from '@ga/core/store/actions/settings/settings.actions';
import { initialState } from '../../reducers/settings/settings.reducer';
import { SettingsEffects } from './settings.effects';

jest.mock('@ga/core/helpers/settings-helpers', () => ({
  detectAppDelivery: jest.fn(() => 'standalone'),
}));

describe('Settings Effects', () => {
  let action: any;
  let actions$: any;
  let effects: SettingsEffects;
  let spectator: SpectatorService<SettingsEffects>;
  let router: Router;

  const createService = createServiceFactory({
    service: SettingsEffects,
    imports: [RouterTestingModule, TranslocoTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({
        initialState: {
          settings: {
            ...initialState,
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(SettingsEffects);
    router = spectator.inject(Router);

    router.navigate = jest.fn();
  });

  describe('initEffects$', () => {
    it(
      'should dispatch app delivery action',
      marbles((m) => {
        action = initSettingsEffects();
        const result = setAppDelivery({ appDelivery: 'standalone' });

        actions$ = m.hot('-a', { a: action });

        const expected$ = m.cold('-b', { b: result });

        m.expect(effects.initEffects$).toBeObservable(expected$);
        m.flush();
      })
    );
  });

  describe('router$', () => {
    it(
      'should return setCurrentStep with 0 on greaseCalculation bearing route',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: { routerState: { url: 'greaseCalculation/bearing' } },
        };
        actions$ = m.hot('-a', {
          a: action,
        });

        const result = setCurrentStep({ step: 0 });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();
      })
    );
    it(
      'should return setCurrentStep with 1 on greaseCalculation parameters route',
      marbles((m) => {
        action = {
          type: ROUTER_NAVIGATED,
          payload: {
            routerState: { url: 'greaseCalculation/parameters?bearing=b1' },
          },
        };
        actions$ = m.hot('-a', {
          a: action,
        });

        const result = setCurrentStep({ step: 1 });
        const expected = m.cold('-b', { b: result });

        m.expect(effects.router$).toBeObservable(expected);
        m.flush();
      })
    );
  });

  describe('ngrxOnInitEffects', () => {
    test('should dispatch init action', () => {
      expect(effects.ngrxOnInitEffects()).toEqual(initSettingsEffects());
    });
  });
});
