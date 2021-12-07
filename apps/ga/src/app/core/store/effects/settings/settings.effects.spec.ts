import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TranslocoService, TranslocoTestingModule } from '@ngneat/transloco';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { initialState } from '../../reducers/settings/settings.reducer';
import {
  setCurrentStep,
  setLanguage,
} from './../../actions/settings/settings.actions';
import { SettingsEffects } from './settings.effects';

describe('Settings Effects', () => {
  let action: any;
  let actions$: any;
  let effects: SettingsEffects;
  let spectator: SpectatorService<SettingsEffects>;
  let router: Router;
  let translocoService: TranslocoService;

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
    translocoService = spectator.inject(TranslocoService);

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

  describe('setLanguage$', () => {
    it(
      'should set the active language',
      marbles((m) => {
        translocoService.setActiveLang = jest.fn();
        action = setLanguage({ language: 'language' });

        actions$ = m.hot('-a', { a: action });

        effects.setLanguage$.subscribe(() => {
          expect(translocoService.setActiveLang).toHaveBeenCalledWith(
            'language'
          );
        });
      })
    );
  });
});
