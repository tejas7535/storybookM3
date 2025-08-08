import { BehaviorSubject, of } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { RecommendationType } from '@gq/core/store/transactions/models/recommendation-type.enum';
import { TransactionsFacade } from '@gq/core/store/transactions/transactions.facade';
import { CurrencyService } from '@gq/shared/services/rest/currency/currency.service';
import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { FilterChangedEvent } from 'ag-grid-enterprise';
import { MockBuilder } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../testing/mocks';
import { QUOTATION_MOCK } from '../../../testing/mocks/models/quotation';
import { QUOTATION_DETAIL_MOCK } from '../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { TransactionViewComponent } from './transaction-view.component';

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

  const dependencies = MockBuilder(TransactionViewComponent)
    .mock(TranslocoService, {
      selectTranslateObject: jest.fn(
        () => new BehaviorSubject({ test: 'test' }) as any
      ),
    })
    .mock(ActiveCaseFacade, {
      selectedQuotationDetail$: of(QUOTATION_DETAIL_MOCK),
      quotationLoading$: of(false),
      quotationCurrency$: currency$$.asObservable(),
      detailViewQueryParams$: of({} as any),
    })
    .mock(CurrencyService, {
      getExchangeRateForCurrency: jest
        .fn()
        .mockReturnValue(of(EXCHANGE_RATE_MOCK)),
    })
    .mock(TransactionsFacade, {
      transactions$: of(mockTransactions),
      transactionsLoading$: of(false),
      graphTransactions$: of(mockTransactions),
      recommendationType$: recommendationType$$.asObservable(),
    })
    .mock(RolesFacade, {
      userHasGPCRole$: of(false),
      userHasRoles$: jest.fn(() => of(false)),
    })
    .build();

  const createComponent = createComponentFactory({
    component: TransactionViewComponent,
    ...dependencies,
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
        m.cold('a', { a: true })
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
    test(
      'should return all transactions if there is no filter',
      marbles((m) => {
        m.expect(component.graphTransactions$).toBeObservable(
          m.cold('a', { a: mockTransactions })
        );
      })
    );

    test(
      'should return no transactions if all were filtered out',
      marbles((m) => {
        component.onFilterChanged({
          api: {
            forEachNodeAfterFilter: jest.fn().mockImplementation(),
          } as any,
          columns: [],
          type: 'filterChanged',
        } as FilterChangedEvent);
        m.expect(component.graphTransactions$).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );

    test(
      'should update graphTransactions if the filter changes',
      marbles((m) => {
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

        m.expect(component.graphTransactions$).toBeObservable(
          m.cold('a', { a: [mockTransactions[0], mockTransactions[2]] })
        );
      })
    );
  });

  describe('onFilterChanged', () => {
    test(
      'should emit empty rows',
      marbles((m) => {
        component.onFilterChanged({
          api: {
            forEachNodeAfterFilter: jest.fn(),
          } as any,
          columns: [],
          type: 'filterChanged',
        } as FilterChangedEvent);

        m.expect(component.filteredTransactionIdentifier).toBeObservable(
          m.cold('a', { a: [] })
        );
      })
    );

    test(
      'should emit identifiers of filtered rows',
      marbles((m) => {
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

        m.expect(component.filteredTransactionIdentifier).toBeObservable(
          m.cold('a', { a: [1, 2, 3] })
        );
      })
    );
  });
});
