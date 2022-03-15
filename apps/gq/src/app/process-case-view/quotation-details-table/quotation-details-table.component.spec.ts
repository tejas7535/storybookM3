import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridEvent } from '@ag-grid-community/all-modules';
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
import { Quotation } from '../../shared/models';
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
    component.quotation = { gqId: 12 } as Quotation;
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
    let event: any;

    beforeEach(() => {
      event = {
        columnApi: {
          getColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any;

      component['agGridStateService'].setColumnData = jest.fn();
      component['agGridStateService'].setColumnState = jest.fn();
    });

    test('should set column state', () => {
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnState
      ).toHaveBeenCalledTimes(1);
    });

    test('should set column data', () => {
      component['agGridStateService'].setColumnState = jest.fn();
      component.onColumnChange(event);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('onGridReady', () => {
    let mockEvent: AgGridEvent;

    beforeEach(() => {
      mockEvent = {
        columnApi: {
          setColumnState: jest.fn(),
        },
        api: {
          forEachNodeAfterFilterAndSort: jest.fn(),
        },
      } as any;

      component['agGridStateService'].getColumnState = jest.fn();
      component['agGridStateService'].getColumnData = jest.fn();
      component['agGridStateService'].setColumnData = jest.fn();
    });

    test('should set columnState', () => {
      component['agGridStateService'].getColumnState = jest
        .fn()
        .mockReturnValue('state');
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(mockEvent.columnApi.setColumnState).toHaveBeenCalledTimes(1);
    });

    test('should not set columnState', () => {
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].getColumnState
      ).toHaveBeenCalledTimes(1);
      expect(mockEvent.columnApi.setColumnState).toHaveBeenCalledTimes(0);
    });

    test("should set column data if it doesn't exist", () => {
      component['agGridStateService'].getColumnData = jest
        .fn()
        .mockImplementation(() => {});
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(1);
    });

    test('should NOT set column data if already exist', () => {
      component['agGridStateService'].getColumnData = jest
        .fn()
        .mockImplementation(() => [
          {
            gqPositionId: '123',
            quotationItemId: '456',
          },
        ]);
      component.onGridReady(mockEvent);

      expect(
        component['agGridStateService'].setColumnData
      ).toHaveBeenCalledTimes(0);
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
