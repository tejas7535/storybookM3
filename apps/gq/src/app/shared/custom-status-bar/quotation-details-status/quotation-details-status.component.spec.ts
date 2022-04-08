import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { SpyObject } from '@ngneat/spectator';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getRoles } from '@schaeffler/azure-auth';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
} from '../../../../testing/mocks';
import { StatusBarModalComponent } from '../../components/modal/status-bar-modal/status-bar-modal.component';
import { StatusBarProperties } from '../../models';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { UserRoles } from '../../roles/user-roles.enum';
import { PriceService } from '../../services/price-service/price.service';
import { QuotationDetailsStatusComponent } from './quotation-details-status.component';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('QuotationDetailsStatusComponent', () => {
  let component: QuotationDetailsStatusComponent;
  let spectator: Spectator<QuotationDetailsStatusComponent>;
  let params: IStatusPanelParams;
  let store: MockStore;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: QuotationDetailsStatusComponent,
    imports: [
      MatButtonModule,
      MatIconModule,
      MatSnackBarModule,
      provideTranslocoTestingModule({ en: {} }),
      ReactiveComponentModule,
      MatDialogModule,
      SharedPipesModule,
    ],
    mocks: [MatDialog],

    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          'azure-auth': {},
          processCase: PROCESS_CASE_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    matDialogSpyObject = spectator.inject(MatDialog);
    params = {
      api: {
        addEventListener: jest.fn(),
        getSelectedRows: jest.fn().mockReturnValue([QUOTATION_DETAIL_MOCK]),
        forEachNode: jest.fn(),
      },
    } as unknown as IStatusPanelParams;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set showMargins to true', () => {
      store.overrideSelector(getRoles, [UserRoles.COST_GPC]);

      component.ngOnInit();

      expect(component.showGPI$).toBeTruthy();
    });
  });
  describe('onRowDataChanged', () => {
    beforeEach(() => {
      component['params'] = params;
      component.onSelectionChange = jest.fn();
    });
    test('should set margin and Value if data exists', () => {
      const rowNode = {
        data: {
          netValue: QUOTATION_DETAIL_MOCK.netValue,
          gpi: QUOTATION_DETAIL_MOCK.gpi,
        },
      };
      PriceService.calculateStatusBarValues = jest.fn(
        () =>
          new StatusBarProperties(
            QUOTATION_DETAIL_MOCK.netValue,
            QUOTATION_DETAIL_MOCK.gpi,
            QUOTATION_DETAIL_MOCK.gpm,
            QUOTATION_DETAIL_MOCK.priceDiff,
            1
          )
      );
      component['params'].api.forEachNode = jest.fn((callback) =>
        callback(rowNode as any, 1)
      );

      component.rowValueChanges();

      expect(component.statusBar.total.netValue).toEqual(
        QUOTATION_DETAIL_MOCK.netValue
      );
      expect(component.statusBar.total.gpi).toEqual(QUOTATION_DETAIL_MOCK.gpi);
      expect(component.statusBar.total.gpm).toEqual(QUOTATION_DETAIL_MOCK.gpm);
      expect(component.statusBar.total.priceDiff).toEqual(
        QUOTATION_DETAIL_MOCK.priceDiff
      );
      expect(component.statusBar.total.rows).toEqual(1);
      expect(PriceService.calculateStatusBarValues).toHaveBeenCalledTimes(1);
      expect(component.onSelectionChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('onSelectionChange', () => {
    test('should set selections', () => {
      component['params'] = params;
      component.onSelectionChange();

      expect(params.api.getSelectedRows).toHaveBeenCalled();
      expect(component.statusBar.selected.netValue).toEqual(
        QUOTATION_DETAIL_MOCK.netValue
      );
      expect(component.statusBar.selected.gpi).toEqual(
        QUOTATION_DETAIL_MOCK.gpi
      );
      expect(component.statusBar.selected.gpm).toEqual(
        QUOTATION_DETAIL_MOCK.gpm
      );
      expect(component.statusBar.selected.priceDiff).toEqual(
        QUOTATION_DETAIL_MOCK.priceDiff
      );
      expect(component.statusBar.selected.rows).toEqual(1);
    });
  });
  describe('showAll', () => {
    test('should open dialog', () => {
      component.showAll();

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        StatusBarModalComponent,
        {
          width: '600px',
          data: component.statusBar,
        }
      );
    });
  });
});
