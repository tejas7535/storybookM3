import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';

import { steps } from '../../../../shared/constants';
import { GreaseCalculationPath } from './../../../../grease-calculation/grease-calculation-path.enum';
import { Step } from './../../../../shared/models/settings/step.model';
import { setCurrentStep } from './../../actions/settings/settings.actions';

@Injectable()
export class SettingsEffects {
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
}
