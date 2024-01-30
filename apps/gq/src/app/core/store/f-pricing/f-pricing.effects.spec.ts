import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FPricingData } from '@gq/shared/models/f-pricing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { FPricingActions } from './f-pricing.actions';
import { FPricingEffects } from './f-pricing.effects';
import { initialState } from './f-pricing.reducer';

describe('FPricingEffects', () => {
  let actions$: any;
  let spectator: SpectatorService<FPricingEffects>;
  let effects: FPricingEffects;

  const createService = createServiceFactory({
    service: FPricingEffects,
    imports: [HttpClientTestingModule],
    providers: [
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { fPricing: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    effects = spectator.service;
    actions$ = spectator.inject(Actions);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('getAllFPricingData$', () => {
    test(
      'should dispatch loadFPricingDataSuccess',
      marbles((m) => {
        const gqPositionId = '1234';
        const response = {
          gqPositionId: '1234',
          referencePrice: 100_000,
        } as FPricingData;
        const action = FPricingActions.loadFPricingData({ gqPositionId });

        effects['fPricingService'].getFPricingData = () =>
          m.cold('a', { a: response });

        const result = FPricingActions.loadFPricingDataSuccess({
          data: response,
        });
        const expected = m.cold('b', { b: result });

        actions$ = m.hot('a', { a: action });
        m.expect(effects.getAllFPricingData$).toBeObservable(expected);
        m.flush();
      })
    );

    test(
      'Should dispatch error action',
      marbles((m) => {
        const gqPositionId = '1234';
        const error = new Error('Error');

        const action = FPricingActions.loadFPricingData({ gqPositionId });
        const result = FPricingActions.loadFPricingDataFailure({ error });

        actions$ = new Actions(m.cold('a', { a: action }));

        effects['fPricingService'].getFPricingData = () =>
          m.cold('-#', {}, error);

        const expected = m.cold('--b', { b: result });

        actions$ = m.hot('-a', { a: action });
        m.expect(effects.getAllFPricingData$).toBeObservable(expected);
        m.flush();
      })
    );
  });
});
