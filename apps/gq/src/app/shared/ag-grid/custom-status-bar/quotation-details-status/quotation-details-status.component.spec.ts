import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { StatusBarModalComponent } from '@gq/shared/components/modal/status-bar-modal/status-bar-modal.component';
import { StatusBarProperties } from '@gq/shared/models/status-bar.model';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TransformationService } from '@gq/shared/services/transformation/transformation.service';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { IStatusPanelParams } from 'ag-grid-community';
import { marbles } from 'rxjs-marbles';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  ACTIVE_CASE_STATE_MOCK,
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../../testing/mocks';
import { QuotationDetailsStatusComponent } from './quotation-details-status.component';

describe('QuotationDetailsStatusComponent', () => {
  let component: QuotationDetailsStatusComponent;
  let spectator: Spectator<QuotationDetailsStatusComponent>;
  let params: IStatusPanelParams;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: QuotationDetailsStatusComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushModule,
      SharedPipesModule,
    ],
    mocks: [MatDialog],
    providers: [
      {
        provide: TransformationService,
        useValue: {
          transformNumberCurrency: jest.fn(),
          transformPercentage: jest.fn(),
        },
      },

      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
        },
      }),
      {
        provide: TransformationService,
        useValue: {
          transformPercentage: jest.fn(),
          transformNumberCurrency: jest.fn(),
        },
      },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
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
    test(
      'should initalize observables',
      marbles((m) => {
        component.ngOnInit();
        m.expect(component.showGPI$).toBeObservable('a', { a: true });
        m.expect(component.showGPM$).toBeObservable('a', { a: true });
        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: QUOTATION_MOCK.currency,
        });
        m.expect(component.simulationModeEnabled$).toBeObservable('a', {
          a: false,
        });
        m.expect(component.simulatedQuotation$).toBeObservable('a', {
          a: undefined,
        });
      })
    );
  });
  describe('onRowDataUpdated', () => {
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
      jest
        .spyOn(pricingUtils, 'calculateStatusBarValues')
        .mockImplementation(
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
      expect(pricingUtils.calculateStatusBarValues).toHaveBeenCalledTimes(1);
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
