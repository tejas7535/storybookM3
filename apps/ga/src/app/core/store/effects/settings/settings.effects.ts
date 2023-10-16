import { Injectable } from '@angular/core';

import { filter, map, mergeMap } from 'rxjs';

import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { Action } from '@ngrx/store';

import {
  detectAppDelivery,
  detectPartnerVersion,
} from '@ga/core/helpers/settings-helpers';
import {
  initSettingsEffects,
  setAppDelivery,
  setCurrentStep,
  setPartnerVersion,
} from '@ga/core/store/actions/settings/settings.actions';
import { GreaseCalculationPath } from '@ga/features/grease-calculation/grease-calculation-path.enum';
import { steps } from '@ga/shared/constants';
import { Step } from '@ga/shared/models/settings/step.model';

@Injectable()
export class SettingsEffects implements OnInitEffects {
  initEffects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(initSettingsEffects),
      mergeMap(() => [
        setAppDelivery({ appDelivery: detectAppDelivery() }),
        setPartnerVersion({ partnerVersion: detectPartnerVersion() }),
      ])
    );
  });

  router$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATED),
      map(
        ({
          payload: {
            routerState: { url },
          },
        }: RouterNavigatedAction) =>
          url.includes('?') ? url.split('?')[0] : url
      ),
      map((url: string) =>
        Object.values({ ...GreaseCalculationPath }).find(
          (route: string) => route !== '' && url.includes(route)
        )
      ),
      filter((currentRoute: string) => !!currentRoute),
      map((currentRoute: string) => {
        const step = steps.find(
          ({ link }: Step) => link === currentRoute
        ).index;

        return setCurrentStep({ step });
      })
    );
  });

  constructor(private readonly actions$: Actions) {}

  ngrxOnInitEffects(): Action {
    return initSettingsEffects();
  }
}
