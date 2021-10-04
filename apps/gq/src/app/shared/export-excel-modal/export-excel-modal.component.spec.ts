import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { from, of } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../testing/mocks/extended-comparable-linked-transaction.mock';
import { loadExtendedComparableLinkedTransaction } from '../../core/store/actions/extended-comparable-linked-transactions/extended-comparable-linked-transactions.actions';
import { DialogHeaderModule } from '../header/dialog-header/dialog-header.module';
import { ExportExcelModalComponent } from './export-excel-modal.component';
import { ExportExcel } from './export-excel.enum';

describe('ExportExcelModalComponent', () => {
  let component: ExportExcelModalComponent;
  let spectator: Spectator<ExportExcelModalComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: ExportExcelModalComponent,
    imports: [
      MatRadioModule,
      MatDialogModule,
      FormsModule,
      MatIconModule,
      ReactiveComponentModule,
      LoadingSpinnerModule,
      DialogHeaderModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          extendedComparableLinkedTransactions: {
            errorMessage: '',
          },
          processCase: {
            quotation: {
              item: EXTENDED_COMPARABLE_LINKED_TRANSACTION_MOCK,
            },
          },
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
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

  describe('closeDialog', () => {
    test('should close dialog', () => {
      component.dialogRef.close = jest.fn();

      component.closeDialog();

      expect(component.dialogRef.close).toHaveBeenCalledTimes(1);
      expect(component.dialogRef.close).toHaveBeenLastCalledWith(
        ExportExcel.DETAILED_DOWNLOAD
      );
    });
  });

  describe('fetchTransactions', () => {
    beforeEach(() => {
      store.dispatch = jest.fn();
      component.closeDialog = jest.fn();
      component.gQId = 45;
    });

    test('dispatch loadExtendedComparableLinkedTransaction', () => {
      component.exportExcelOption = ExportExcel.DETAILED_DOWNLOAD;

      component.fetchTransactions();

      expect(store.dispatch).toHaveBeenCalledWith(
        loadExtendedComparableLinkedTransaction({
          quotationNumber: component.gQId,
        })
      );
    });

    test('does not dispatch loadExtendedComparableLinkedTransaction', () => {
      component.exportExcelOption = ExportExcel.BASIC_DOWNLOAD;

      component.fetchTransactions();

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
    });
  });

  describe('addSubscription', () => {
    test('combineLatest', () => {
      component.closeDialog = jest.fn();
      const loadingStopped$ = from([true, false]);
      const errorMessage$ = of(undefined as any);

      component.addSubscription(errorMessage$, loadingStopped$);

      expect(component.closeDialog).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    test('call addSubscription', () => {
      component.addSubscription = jest.fn();

      component.ngOnInit();

      expect(component.addSubscription).toHaveBeenCalled();
    });
  });
});
