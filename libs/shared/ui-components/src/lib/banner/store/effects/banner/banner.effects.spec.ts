import { HotObservable } from 'jest-marbles/typings/src/rxjs/hot-observable';

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';

import { cold, hot } from 'jest-marbles';
import { configureTestSuite } from 'ng-bullet';

import { BannerService } from './../../../banner.service';

import { BannerEffects } from './banner.effects';

import { finishOpenBanner, openBanner, setBannerUrl } from '../../actions';

describe('BannerEffects', () => {
  let action: Action;
  let actions$: HotObservable;
  let effects: BannerEffects;
  let router: Router;
  let bannerService: BannerService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        BannerService,
        BannerEffects,
        provideMockActions(() => actions$)
      ]
    });
  });

  beforeEach(() => {
    actions$ = TestBed.get(Actions);
    effects = TestBed.get(BannerEffects);
    router = TestBed.get(Router);
    bannerService = TestBed.get(BannerService);
  });

  describe('openBanner', () => {
    beforeEach(() => {
      action = openBanner({
        component: '',
        text: 'string',
        buttonText: 'string',
        truncateSize: 0
      });
    });

    it('should return SetBannerUrlAction', () => {
      const outcome = setBannerUrl({
        url: router.url
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.openBanner$).toBeObservable(expected);
    });
  });

  describe('setBannerUrl', () => {
    beforeEach(() => {
      action = setBannerUrl({
        url: ''
      });
    });

    it('should return FinishOpenBannerAction', () => {
      const outcome = finishOpenBanner();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: outcome });

      expect(effects.setBannerUrl$).toBeObservable(expected);
    });
  });
});
