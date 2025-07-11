import { of } from 'rxjs';

import { Capacitor } from '@capacitor/core';
import { InAppReview } from '@capacitor-community/in-app-review';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';

import { calculationSuccess } from '../../actions';
import {
  AppRatingEffects,
  CALCULATION_COUNTER_STORAGE_KEY,
  REVIEW_PROMPT_THRESHOLD,
} from './app-rating.effects';

jest.mock('@capacitor-community/in-app-review', () => ({
  InAppReview: {
    requestReview: jest.fn(),
  },
}));

Capacitor.isNativePlatform = jest.fn(() => true);
InAppReview.requestReview = jest.fn();

describe('AppRatingEffects', () => {
  let actions$ = of(calculationSuccess({ resultId: 'test est' }));
  let spectator: SpectatorService<AppRatingEffects>;
  let effects: AppRatingEffects;

  const createService = createServiceFactory({
    service: AppRatingEffects,
    providers: [
      provideMockActions(() => actions$),
      {
        provide: LOCAL_STORAGE,
        useValue: {
          getItem: jest.fn(),
          setItem: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(AppRatingEffects);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('calculationCounterEffect$', () => {
    it('should count up for each succesful calculation', () => {
      (effects['localStorage'].getItem as jest.Mock).mockReturnValue('1');
      actions$ = of(calculationSuccess({ resultId: 'test' }));
      effects.calculationCounterEffect$.subscribe();
      expect(effects['localStorage'].setItem as jest.Mock).toHaveBeenCalledWith(
        CALCULATION_COUNTER_STORAGE_KEY,
        '2'
      );
    });

    it('should gracefully recover from any invalid numeric value', () => {
      (effects['localStorage'].getItem as jest.Mock).mockReturnValue(
        'BTW, this isnt a number'
      );
      actions$ = of(calculationSuccess({ resultId: 'test' }));
      effects.calculationCounterEffect$.subscribe();
      expect(effects['localStorage'].setItem as jest.Mock).toHaveBeenCalledWith(
        CALCULATION_COUNTER_STORAGE_KEY,
        '1'
      );
    });
  });

  describe('showAppReviewPrompt$', () => {
    it('should call to show the review banner if the threshold is met', () => {
      (effects['localStorage'].getItem as jest.Mock).mockReturnValue(
        REVIEW_PROMPT_THRESHOLD
      );
      actions$ = of(calculationSuccess({ resultId: 'test' }));
      effects.showAppReviewPrompt$.subscribe();
      expect(effects['localStorage'].getItem).toHaveBeenCalledWith(
        CALCULATION_COUNTER_STORAGE_KEY
      );
      expect(InAppReview.requestReview).toHaveBeenCalled();
    });

    it('should skip calling the prompt if the treshold is not met', () => {
      (effects['localStorage'].getItem as jest.Mock).mockReturnValue(
        REVIEW_PROMPT_THRESHOLD - 1
      );
      actions$ = of(calculationSuccess({ resultId: 'test' }));
      effects.showAppReviewPrompt$.subscribe();
      expect(effects['localStorage'].getItem).toHaveBeenCalledWith(
        CALCULATION_COUNTER_STORAGE_KEY
      );
      expect(InAppReview.requestReview).not.toHaveBeenCalled();
    });

    it('should not call the review when the threshold is exceeded', () => {
      (effects['localStorage'].getItem as jest.Mock).mockReturnValue(
        REVIEW_PROMPT_THRESHOLD + 1
      );
      actions$ = of(calculationSuccess({ resultId: 'test' }));
      effects.showAppReviewPrompt$.subscribe();
      expect(effects['localStorage'].getItem).toHaveBeenCalledWith(
        CALCULATION_COUNTER_STORAGE_KEY
      );
      expect(InAppReview.requestReview).not.toHaveBeenCalled();
    });
  });
});
