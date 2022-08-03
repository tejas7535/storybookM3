import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AgGridModule } from '@ag-grid-community/angular';
import { RowNode } from '@ag-grid-community/core';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { VIEW_CASE_STATE_MOCK } from '../../../testing/mocks';
import { AppRoutePath } from '../../app-route-path.enum';
import { getSelectedCaseIds } from '../../core/store';
import { CreateCustomerCaseButtonComponent } from '../../shared/ag-grid/custom-status-bar/case-view/create-customer-case-button/create-customer-case-button.component';
import { CreateManualCaseButtonComponent } from '../../shared/ag-grid/custom-status-bar/case-view/create-manual-case-button/create-manual-case-button.component';
import { ImportCaseButtonComponent } from '../../shared/ag-grid/custom-status-bar/case-view/import-case-button/import-case-button.component';
import { CustomStatusBarModule } from '../../shared/ag-grid/custom-status-bar/custom-status-bar.module';
import { DeleteCaseButtonComponent } from '../../shared/ag-grid/custom-status-bar/delete-case-button/delete-case-button.component';
import { HelperService } from '../../shared/services/helper-service/helper-service.service';
import { CaseTableComponent } from './case-table.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('CaseTableComponent', () => {
  let component: CaseTableComponent;
  let spectator: Spectator<CaseTableComponent>;
  let store: MockStore;
  let router: Router;

  const createComponent = createComponentFactory({
    component: CaseTableComponent,
    imports: [
      AgGridModule.withComponents({
        DeleteCaseButtonComponent,
        ImportCaseButtonComponent,
        CreateManualCaseButtonComponent,
        CreateCustomerCaseButtonComponent,
      }),
      CustomStatusBarModule,
      RouterTestingModule.withRoutes([]),
      MatDialogModule,
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
    ],
    providers: [
      provideMockStore({
        initialState: VIEW_CASE_STATE_MOCK,
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      { provide: HelperService, useValue: {} },
    ],
    declarations: [CaseTableComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    router = spectator.inject(Router);
    router.navigate = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    test('should take selected cases from the store', () => {
      expect(component.selectedRows).toEqual(undefined);

      store.overrideSelector(getSelectedCaseIds, [1234]);
      component.ngOnInit();

      expect(component.selectedRows).toEqual([1234]);
    });
  });

  describe('onGridReady', () => {
    test('should select rows from state', () => {
      const nodes = [
        { data: { gqId: 1234 }, setSelected: jest.fn() } as any,
        { data: { gqId: 5678 }, setSelected: jest.fn() } as any,
      ];
      const mockEvent = {
        api: {
          forEachNode: (callback: (row: RowNode) => void) =>
            nodes.forEach((element) => {
              callback(element);
            }),
        },
      } as any;

      component.selectedRows = [1234];
      component.onGridReady(mockEvent);

      expect(nodes[0].setSelected).toHaveBeenCalledWith(true);
      expect(nodes[1].setSelected).not.toHaveBeenCalled();
    });
  });

  describe('onRowSelected', () => {
    test('should dispatch row selected', () => {
      store.dispatch = jest.fn();
      component.onRowSelected({
        node: { isSelected: () => true, data: { gqId: 1234 } },
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: 1234,
        type: '[View Cases] Select a Case',
      });
    });

    test('should dispatch row deselected', () => {
      store.dispatch = jest.fn();
      component.onRowSelected({
        node: { isSelected: () => false, data: { gqId: 1234 } },
      } as any);

      expect(store.dispatch).toHaveBeenCalledWith({
        gqId: 1234,
        type: '[View Cases] Deselect a Case',
      });
    });
  });

  describe('onRowDoubleClick', () => {
    test('should navigate on double click', () => {
      const mockEvent = {
        data: {
          gqId: 1234,
          customerIdentifiers: {
            customerId: 'customer-id',
            salesOrg: 'sales-org-id',
          },
        },
      } as any;
      component.onRowDoubleClicked(mockEvent);

      expect(router.navigate).toHaveBeenCalledWith(
        [AppRoutePath.ProcessCaseViewPath],
        {
          queryParamsHandling: 'merge',
          queryParams: {
            quotation_number: mockEvent.data.gqId,
            customer_number: mockEvent.data.customerIdentifiers.customerId,
            sales_org: mockEvent.data.customerIdentifiers.salesOrg,
          },
        }
      );
    });
  });
});
