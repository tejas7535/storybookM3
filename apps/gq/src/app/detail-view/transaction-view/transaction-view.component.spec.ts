import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { BehaviorSubject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { FilterChangedEvent } from 'ag-grid-community';
import resize_observer_polyfill from 'resize-observer-polyfill';
import { marbles } from 'rxjs-marbles';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  COMPARABLE_LINKED_TRANSACTION_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import {
  PROCESS_CASE_STATE_MOCK,
  TRANSACTIONS_STATE_MOCK,
} from '../../../testing/mocks/state';
import { getSelectedQuotationDetail } from '../../core/store';
import { CustomerHeaderModule } from '../../shared/components/header/customer-header/customer-header.module';
import { MaterialPriceHeaderContentModule } from '../../shared/components/header/material-price-header-content/material-price-header-content.module';
import { HelperService } from '../../shared/services/helper-service/helper-service.service';
import { ComparableTransactionsModule } from './comparable-transactions/comparable-transactions.module';
import { SavingInProgressComponent } from './saving-in-progress/saving-in-progress.component';
import { TransactionViewComponent } from './transaction-view.component';
import { TransparencyGraphModule } from './transparency-graph/transparency-graph.module';
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
    imports: [
      ComparableTransactionsModule,
      TransparencyGraphModule,
      MatCardModule,
      LoadingSpinnerModule,
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
      MaterialPriceHeaderContentModule,
      RouterTestingModule,
      SubheaderModule,
      BreadcrumbsModule,
      ShareButtonModule,
      MatSnackBarModule,
      CustomerHeaderModule,
    ],
    declarations: [SavingInProgressComponent],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      {
        provide: ApplicationInsightsService,
        useValue: {},
      },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          transactions: {
            ...TRANSACTIONS_STATE_MOCK,
            transactions: mockTransactions,
          },
          'azure-auth': {
            accountInfo: { backendRoles: [] },
          },
        },
      }),
      {
        provide: HelperService,
        useValue: {
          transformMarginDetails: jest.fn(),
          transformPercentage: jest.fn(),
        },
      },
    ],
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
