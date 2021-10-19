import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../testing/mocks';
import { CustomStatusBarModule } from '../../shared/custom-status-bar/custom-status-bar.module';
import { DeleteItemsButtonComponent } from '../../shared/custom-status-bar/delete-items-button/delete-items-button.component';
import { QuotationDetailsStatusComponent } from '../../shared/custom-status-bar/quotation-details-status/quotation-details-status.component';
import { QuotationDetailsTableComponent } from './quotation-details-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QuotationDetailsTableComponent', () => {
  let component: QuotationDetailsTableComponent;
  let spectator: Spectator<QuotationDetailsTableComponent>;

  const createComponent = createComponentFactory({
    component: QuotationDetailsTableComponent,
    declarations: [QuotationDetailsTableComponent],
    detectChanges: false,
    imports: [
      AgGridModule.withComponents([
        QuotationDetailsStatusComponent,
        DeleteItemsButtonComponent,
      ]),
      CustomStatusBarModule,
      MatDialogModule,
      ReactiveComponentModule,
      RouterTestingModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set columnDefs', () => {
      component.ngOnInit();

      expect(component.columnDefs$).toBeDefined();
    });
  });
  describe('set quotation', () => {
    test('should set rowData and tableContext.currency', () => {
      component.quotation = QUOTATION_MOCK;

      expect(component.rowData).toEqual(QUOTATION_MOCK.quotationDetails);
      expect(component.tableContext.quotation.currency).toEqual(
        QUOTATION_MOCK.currency
      );
    });
  });

  describe('columnChange', () => {
    test('should set column state', () => {
      const event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].setColumnState = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('onGridReady', () => {
    test('should set columnState', () => {
      const event = {
        columnApi: {
          setColumnState: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnState = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.setColumnState).toHaveBeenCalledTimes(1);
    });
    test('should not set columnState', () => {
      const event = {
        columnApi: {
          setColumnState: jest.fn(),
        },
      } as any;
      component['agGridStateService'].getColumnState = jest.fn();
      component.onGridReady(event);
      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(event.columnApi.setColumnState).toHaveBeenCalledTimes(0);
    });
  });

  describe('onFirstDataRenderer', () => {
    test('should call autoSizeAllColumns', () => {
      const params = {
        columnApi: {
          autoSizeAllColumns: jest.fn(),
        },
      } as any;

      component.onFirstDataRendered(params);

      expect(params.columnApi.autoSizeAllColumns).toHaveBeenCalledTimes(1);
    });
  });
});
