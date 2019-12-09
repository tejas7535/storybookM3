import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions, createEffect, ofType } from '@ngrx/effects';

import { BannerService } from './../../../banner.service';

import * as BannerActions from '../../actions';

@Injectable()
export class BannerEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly bannerService: BannerService,
    private readonly router: Router
  ) {}

  openBanner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.openBanner),
      map(action => {
        this.bannerService.openBanner(action.component);

        return BannerActions.setBannerUrl({ url: this.router.url });
      })
    )
  );

  setBannerUrl$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BannerActions.setBannerUrl),
      map(() => {
        return BannerActions.finishOpenBanner();
      })
    )
  );
}
