import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { getSelectedQuotationDetail } from '@gq/core/store/active-case/active-case.selectors';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FilterChangedEvent } from 'ag-grid-community';
import resize_observer_polyfill from 'resize-observer-polyfill';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import {
  ACTIVE_CASE_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  TRANSACTIONS_STATE_MOCK,
} from '../../../testing/mocks/state';
import { TransactionViewComponent } from './transaction-view.component';
window.ResizeObserver = resize_observer_polyfill;

describe('TransactionViewComponent', () => {
  let component: TransactionViewComponent;
  let spectator: Spectator<TransactionViewComponent>;
  let store: MockStore;
  const mockTransactions = [
    { ...COMPARABLE_LINKED_TRANSACTION_MOCK, identifier: 1111 },
    { ...COMPARABLE_LINKED_TRANSACTION_MOCK, identifier: 2222 },
    { ...COMPARABLE_LINKED_TRANSACTION_MOCK, identifier: 3333 },
  ];

  const createComponent = createComponentFactory({
    component: TransactionViewComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), PushPipe],

    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
          transactions: {
            ...TRANSACTIONS_STATE_MOCK,
            transactions: mockTransactions,
          },
          'azure-auth': {
            accountInfo: { backendRoles: [] },
          },
        },
      }),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initalize observables',
      marbles((m) => {
        store.overrideSelector(
          getSelectedQuotationDetail,
          QUOTATION_DETAIL_MOCK
        );
        component['translocoService'].selectTranslateObject = jest.fn(
          () => new BehaviorSubject({ test: 'test' }) as any
        );

        component.ngOnInit();

        m.expect(component.quotationDetail$).toBeObservable(
          m.cold('a', { a: QUOTATION_DETAIL_MOCK })
        );
        m.expect(component.quotationLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.quotationCurrency$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK.currency })
        );
        m.expect(component.transactions$).toBeObservable(
          m.cold('a', { a: mockTransactions })
        );
        m.expect(component.transactionsLoading$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.translationsLoaded$).toBeObservable(
          m.cold('a', { a: true })
        );
        m.expect(component.hasGpcRole$).toBeObservable(
          m.cold('a', { a: false })
        );
        m.expect(component.hideRolesHint$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );
  });

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
        columnApi: {},
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
        columnApi: {},
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
        columnApi: {},
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
        columnApi: {},
        columns: [],
        type: 'filterChanged',
      } as FilterChangedEvent);

      expect(result).toEqual([1, 2, 3]);
    });
  });
});
