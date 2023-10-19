import { FormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { MatRadioModule } from '@angular/material/radio';

import { from, of } from 'rxjs';

import { loadExtendedComparableLinkedTransaction } from '@gq/core/store/actions';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
} from '../../../../../testing/mocks';
import { DialogHeaderModule } from '../../../components/header/dialog-header/dialog-header.module';
import { EVENT_NAMES } from '../../../models';
import { ExportExcel } from './export-excel.enum';
import { ExportExcelModalComponent } from './export-excel-modal.component';

describe('ExportExcelModalComponent', () => {
  let component: ExportExcelModalComponent;
  let spectator: Spectator<ExportExcelModalComponent>;
  let store: MockStore;
  let applicationInsightsService: ApplicationInsightsService;

  const createComponent = createComponentFactory({
    component: ExportExcelModalComponent,
    imports: [
      MatRadioModule,
      MatDialogModule,
      FormsModule,
      MatIconModule,
      PushModule,
      LoadingSpinnerModule,
      DialogHeaderModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          extendedComparableLinkedTransactions:
            EXTENDED_COMPARABLE_LINKED_TRANSACTIONS_STATE_MOCK,
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
      {
        provide: MatDialogRef,
        useValue: {},
      },
      {
        provide: MAT_DIALOG_DATA,
        useValue: {
          onlyBasicDownload: false,
        },
      },
      {
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    applicationInsightsService = spectator.inject(ApplicationInsightsService);
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
      jest.resetAllMocks();
    });

    test('dispatch loadExtendedComparableLinkedTransaction', () => {
      component.exportExcelOption = ExportExcel.DETAILED_DOWNLOAD;

      component.fetchTransactions();

      expect(store.dispatch).toHaveBeenCalledWith(
        loadExtendedComparableLinkedTransaction()
      );
    });

    test('does not dispatch loadExtendedComparableLinkedTransaction', () => {
      component.exportExcelOption = ExportExcel.BASIC_DOWNLOAD;

      component.fetchTransactions();

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(component.closeDialog).toHaveBeenCalled();
    });

    test('does not dispatch loadExtendedComparableLinkedTransaction when !extendedDownloadEnabled', () => {
      component.extendedDownloadEnabled = false;
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

  describe('tracking', () => {
    test('should track EXCEL_DOWNLOAD_MODAL_OPENED onInit', () => {
      component.ngOnInit();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.EXCEL_DOWNLOAD_MODAL_OPENED
      );
    });

    test('should track EXCEL_DOWNLOAD_MODAL_CANCELLED on cancel', () => {
      component['dialogRef'].close = jest.fn();
      component.cancelDownload();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.EXCEL_DOWNLOAD_MODAL_CANCELLED
      );
    });

    test('should track EXCEL_DOWNLOADED on closeDialog', () => {
      component.exportExcelOption = ExportExcel.DETAILED_DOWNLOAD;
      component['dialogRef'].close = jest.fn();
      component.closeDialog();

      expect(applicationInsightsService.logEvent).toHaveBeenCalledWith(
        EVENT_NAMES.EXCEL_DOWNLOADED,
        { type: ExportExcel.DETAILED_DOWNLOAD }
      );
    });
  });
});
