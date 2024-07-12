import { provideHttpClientTesting } from '@angular/common/http/testing';

import { BehaviorSubject, ReplaySubject } from 'rxjs';

import {
  OfferType,
  OfferTypeResponse,
} from '@gq/shared/models/offer-type.interface';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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
  const loggedInSubject$$ = new ReplaySubject<boolean>(1);

  let quotationService: QuotationService;
  let store: MockStore;

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
      provideMockStore({
        initialState: { offerType: initialState },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    actions$ = spectator.inject(Actions);
    effects = spectator.inject(OfferTypeEffects);
    store = spectator.inject(MockStore);
    quotationService = spectator.inject(QuotationService);

    store.select = jest.fn(() => loggedInSubject$$.asObservable());
  });

  afterEach(() => {
    loggedInSubject$$.complete();
    jest.clearAllMocks();
  });

  describe('getAllOfferTypes$', () => {
    action = OfferTypeActions.getAllOfferTypes();

    test(
      'shall dispatch success action after getIsLoggedIn first emits false and then true',
      marbles((m) => {
        userHasAccess$$.next(true);
        loggedInSubject$$.next(false);

        const result = OfferTypeActions.getAllOfferTypesSuccess({
          offerTypes: [] as OfferType[],
        });
        const response = m.cold('-a|', {
          a: { results: [] } as OfferTypeResponse,
        });

        quotationService.getOfferTypes = jest.fn(() => response);

        actions$ = m.hot('-a', { a: action });
        // Simulating state change over time using marble diagram
        // subscribe to third frame where getIsLoggedIn emits false, and then emit true for getIsLoggedIn
        const loggedInState$ = m.cold('--a', { a: true });
        loggedInState$.subscribe((val) => loggedInSubject$$.next(val));

        const expected = m.cold('---b', { b: result });
        m.expect(effects.getAllOfferTypes$).toBeObservable(expected);
      })
    );
    test(
      'Should dispatch error action when user does not have access',
      marbles((m) => {
        userHasAccess$$.next(false);
        loggedInSubject$$.next(true);
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
        loggedInSubject$$.next(true);
        const result = OfferTypeActions.getAllOfferTypesSuccess({
          offerTypes: [] as OfferType[],
        });
        actions$ = m.hot('-a', { a: action });

        const response = m.cold('-a|', {
          a: { results: [] } as OfferTypeResponse,
        });
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
        loggedInSubject$$.next(true);
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
