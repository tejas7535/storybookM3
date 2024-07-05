import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BehaviorSubject } from 'rxjs';

import { OfferType } from '@gq/shared/models/offer-type.interface';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockProvider } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { RolesFacade } from '../facades';
import { OfferTypeActions } from './offer-type.actions';
import { OfferTypeEffects } from './offer-type.effects';
import { initialState } from './offer-type.reducer';

describe('OfferTypeEffects', () => {
  let spectator: SpectatorService<OfferTypeEffects>;
  let actions$: Actions;
  let effects: OfferTypeEffects;
  let action: any;
  const userHasAccess$$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  let quotationService: QuotationService;

  const createService = createServiceFactory({
    service: OfferTypeEffects,
    imports: [],
    providers: [
      provideHttpClientTesting(),
      MockProvider(QuotationService),
      MockProvider(RolesFacade, {
        userHasRegionWorldOrGreaterChinaRole$: userHasAccess$$.asObservable(),
      }),
      provideMockActions(() => actions$),
      provideMockStore({ initialState: { offerType: initialState } }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(OfferTypeEffects);

    quotationService = spectator.inject(QuotationService);
  });

  test('should be created', () => {
    expect(effects).toBeTruthy();
    expect(quotationService).toBeTruthy();
  });

  describe('getAllOfferTypes$', () => {
    action = OfferTypeActions.getAllOfferTypes();

    test(
      'Should dispatch error action when user does not have access',
      marbles((m) => {
        userHasAccess$$.next(false);
        const result = OfferTypeActions.getAllOfferTypesFailure({
          errorMessage: 'User does not have access to offer types',
        });
        actions$ = m.hot('-a', { a: action });

        const expected = m.cold('-b', { b: result });
        m.expect(effects.getAllOfferTypes$).toBeObservable(expected);
      })
    );

    test(
      'Should dispatch success action when user has access and rest call is successful',
      marbles((m) => {
        userHasAccess$$.next(true);
        const result = OfferTypeActions.getAllOfferTypesSuccess({
          offerTypes: [] as OfferType[],
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', { a: [] as OfferType[] });
        quotationService.getOfferTypes = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getAllOfferTypes$).toBeObservable(expected);
        m.flush();

        expect(quotationService.getOfferTypes).toHaveBeenCalledTimes(1);
      })
    );

    test(
      'Should dispatch error action when user hasAccess but rest call fails',
      marbles((m) => {
        userHasAccess$$.next(true);
        const errorMessage = 'error';
        const result = OfferTypeActions.getAllOfferTypesFailure({
          errorMessage,
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-#|', undefined, errorMessage);
        quotationService.getOfferTypes = jest.fn(() => response);

        const expected = m.cold('--b', { b: result });
        m.expect(effects.getAllOfferTypes$).toBeObservable(expected);
        m.flush();

        expect(quotationService.getOfferTypes).toHaveBeenCalledTimes(1);
      })
    );
  });
});
