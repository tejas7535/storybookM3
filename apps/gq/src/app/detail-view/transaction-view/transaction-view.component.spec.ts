import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { RecommendationType } from '@gq/core/store/transactions/models/recommendation-type.enum';
import { TransactionsFacade } from '@gq/core/store/transactions/transactions.facade';
import { QuotationService } from '@gq/shared/services/rest/quotation/quotation.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { FilterChangedEvent } from 'ag-grid-enterprise';
import { MockProvider } from 'ng-mocks';
import resize_observer_polyfill from 'resize-observer-polyfill';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../testing/mocks/models/quotation';
import { QUOTATION_DETAIL_MOCK } from '../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { TransactionViewComponent } from './transaction-view.component';
window.ResizeObserver = resize_observer_polyfill;

describe('TransactionViewComponent', () => {
  let component: TransactionViewComponent;
  let spectator: Spectator<TransactionViewComponent>;
  const mockTransactions = [
    { ...COMPARABLE_LINKED_TRANSACTION_MOCK, identifier: 1111 },
    { ...COMPARABLE_LINKED_TRANSACTION_MOCK, identifier: 2222 },
    { ...COMPARABLE_LINKED_TRANSACTION_MOCK, identifier: 3333 },
  ];
  const EXCHANGE_RATE_MOCK = { exchangeRates: { USD: 1.2, EUR: 5 } };

  const recommendationType$$ = new BehaviorSubject(RecommendationType.MARGIN);
  const currency$$ = new BehaviorSubject(QUOTATION_MOCK.currency);

  const createComponent = createComponentFactory({
    component: TransactionViewComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],
    providers: [
      provideMockStore({}),
      MockProvider(QuotationService, {
        getExchangeRateForCurrency: jest
          .fn()
          .mockReturnValue(of(EXCHANGE_RATE_MOCK)),
      }),
      MockProvider(ActiveCaseFacade, {
        selectedQuotationDetail$: of(QUOTATION_DETAIL_MOCK),
        quotationLoading$: of(false),
        quotationCurrency$: currency$$.asObservable(),
        detailViewQueryParams$: of({} as any),
      }),
      MockProvider(TransactionsFacade, {
        transactions$: of(mockTransactions),
        transactionsLoading$: of(false),
        graphTransactions$: of(mockTransactions),
        recommendationType$: recommendationType$$.asObservable(),
      }),
      MockProvider(RolesFacade, {
        userHasGPCRole$: of(false),
        userHasRoles$: jest.fn(() => of(false)),
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('currentEurExchangeRatio$', () => {
    test(
      'should return 1 for EUR currency when recommendationType is PRICE',
      marbles((m) => {
        const expectedExchangeRate$ = m.cold('a', { a: 1 });

        recommendationType$$.next(RecommendationType.PRICE);
        currency$$.next('EUR');

        m.expect(component.currentEurExchangeRatio$).toBeObservable(
          expectedExchangeRate$
        );
      })
    );

    test(
      'should call getExchangeRateForCurrency when currency is not EUR and recommendationType is PRICE',
      marbles((m) => {
        const expectedExchangeRate$ = m.cold('a', { a: 1.2 }); // assuming the mock returns 1.2 for USD

        recommendationType$$.next(RecommendationType.PRICE);
        currency$$.next('USD');

        m.expect(component.currentEurExchangeRatio$).toBeObservable(
          expectedExchangeRate$
        );
      })
    );

    test(
      'should not emit anything if recommendationType is not PRICE',
      marbles((m) => {
        recommendationType$$.next(RecommendationType.MARGIN);
        currency$$.next('USD');

        m.expect(component.currentEurExchangeRatio$).toBeObservable(
          m.cold('-')
        );
      })
    );
  });

  test(
    'should initialize observables',
    marbles((m) => {
      component['translocoService'].selectTranslateObject = jest.fn(
        () => new BehaviorSubject({ test: 'test' }) as any
      );
      currency$$.next('EUR');

      m.expect(component.quotationDetail$).toBeObservable(
        m.cold('(a|)', { a: QUOTATION_DETAIL_MOCK })
      );
      m.expect(component.quotationLoading$).toBeObservable(
        m.cold('(a|)', { a: false })
      );
      m.expect(component.quotationCurrency$).toBeObservable(
        m.cold('a', { a: QUOTATION_MOCK.currency })
      );
      m.expect(component.transactions$).toBeObservable(
        m.cold('(a|)', { a: mockTransactions })
      );
      m.expect(component.transactionsLoading$).toBeObservable(
        m.cold('(a|)', { a: false })
      );
      m.expect(component.translationsLoaded$).toBeObservable(
        m.cold('a', { a: false })
      );
      m.expect(component.recommendationType$).toBeObservable(
        m.cold('a', { a: RecommendationType.MARGIN })
      );
      m.expect(component.hasGpcRole$).toBeObservable(
        m.cold('(a|)', { a: false })
      );
      m.expect(component.hideRolesHint$).toBeObservable(
        m.cold('(a|)', { a: false })
      );
    })
  );

  describe('graphTransactions', () => {
    test('should return all transactions if there is no filter', () => {
      let result;
      spectator
        .output('graphTransactions$')
        .subscribe((value) => (result = value));

      spectator.detectChanges();

      expect(result).toEqual(mockTransactions);
    });

    test('should return no transactions if all were filtered out', () => {
      let result;
      spectator
        .output('graphTransactions$')
        .subscribe((value) => (result = value));

      component.onFilterChanged({
        api: {
          forEachNodeAfterFilter: jest.fn().mockImplementation(),
        } as any,
        columns: [],
        type: 'filterChanged',
      } as FilterChangedEvent);

      expect(result).toEqual([]);
    });

    test('should update graphTransactions if the filter changes', () => {
      let result;
      spectator
        .output('graphTransactions$')
        .subscribe((value) => (result = value));

      const mockFilteredNodes = [
        { data: { identifier: 1111 } },
        { data: { identifier: 3333 } },
      ];

      component.onFilterChanged({
        api: {
          forEachNodeAfterFilter: jest.fn().mockImplementation((callback) => {
            mockFilteredNodes.forEach((node) => callback(node));
          }),
        } as any,
        columns: [],
        type: 'filterChanged',
      } as FilterChangedEvent);

      expect(result).toEqual([mockTransactions[0], mockTransactions[2]]);
    });
  });

  describe('onFilterChanged', () => {
    test('should emit empty rows', () => {
      let result;
      spectator
        .output('filteredTransactionIdentifier')
        .subscribe((transactions) => (result = transactions));

      component.onFilterChanged({
        api: {
          forEachNodeAfterFilter: jest.fn(),
        } as any,
        columns: [],
        type: 'filterChanged',
      } as FilterChangedEvent);

      expect(result).toEqual([]);
    });

    test('should emit identifiers of filtered rows', () => {
      let result;
      spectator
        .output('filteredTransactionIdentifier')
        .subscribe((transactions) => (result = transactions));

      const mockNodes = [
        { data: { identifier: 1 } },
        { data: { identifier: 2 } },
        { data: { identifier: 3 } },
      ];

      component.onFilterChanged({
        api: {
          forEachNodeAfterFilter: jest.fn().mockImplementation((callback) => {
            mockNodes.forEach((node) => callback(node));
          }),
        } as any,
        columns: [],
        type: 'filterChanged',
      } as FilterChangedEvent);

      expect(result).toEqual([1, 2, 3]);
    });
  });
});
