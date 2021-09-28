import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { marbles } from 'rxjs-marbles';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';

import { initialState } from '../../reducers/settings/settings.reducer';
import { setCurrentStep } from './../../actions/settings/settings.actions';
import { SettingsEffects } from './settings.effects';

describe('Settings Effects', () => {
  let action: any;
  let actions$: any;
  let effects: SettingsEffects;
  let spectator: SpectatorService<SettingsEffects>;
  let router: Router;

  const createService = createServiceFactory({
    service: SettingsEffects,
    imports: [RouterTestingModule],
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
});
