import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { ColumnFields } from '../../../../shared/ag-grid/constants/column-fields.enum';
import { EditingModalComponent } from '../../../../shared/components/modal/editing-modal/editing-modal.component';
import { PriceSource } from '../../../../shared/models/quotation-detail';
import { ManualPriceComponent } from './manual-price.component';

describe('ManualPriceComponent', () => {
  let component: ManualPriceComponent;
  let spectator: Spectator<ManualPriceComponent>;
  let matDialogSpyObject: SpyObject<MatDialog>;

  const createComponent = createComponentFactory({
    component: ManualPriceComponent,
    detectChanges: false,
    imports: [
      MatIconModule,
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    mocks: [MatDialog],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    matDialogSpyObject = spectator.inject(MatDialog);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set quotationDetail', () => {
    test('should call setPrice', () => {
      component.setPrice = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      expect(component.setPrice).toHaveBeenCalledTimes(1);
    });
  });

  describe('setPrice', () => {
    test('should reset manual price, if user selects gq or sap price', () => {
      component.quotationDetail = {
        price: 10,
        recommendedPrice: 20,
        gpi: 0.5,
        gpm: 0.6,
        priceSource: PriceSource.SAP_SPECIAL,
      } as any;

      component.setPrice();

      expect(component.price).toEqual(undefined);
      expect(component.gpi).toEqual(undefined);
      expect(component.gpm).toEqual(undefined);
    });
    test('should set manual price kpis to quotationDetail values', () => {
      component.quotationDetail = {
        price: 20,
        recommendedPrice: 20,
        gpi: 0.5,
        gpm: 0.6,
        priceSource: PriceSource.MANUAL,
      } as any;

      component.setPrice();

      expect(component.price).toBe(20);
      expect(component.gpi).toBe(0.5);
      expect(component.gpm).toBe(0.6);
    });
  });

  describe('openEditing', () => {
    beforeEach(() => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
    });
    test('should open editing modal for gpi', () => {
      component.openEditing(ColumnFields.GPI);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPI,
          },
          width: '684px',
        }
      );
    });
    test('should open editing modal for gpm', () => {
      component.openEditing(ColumnFields.GPM);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.GPM,
          },
          width: '684px',
        }
      );
    });
    test('should open editing modal for price', () => {
      component.openEditing(ColumnFields.PRICE);

      expect(matDialogSpyObject.open).toHaveBeenCalledWith(
        EditingModalComponent,
        {
          data: {
            quotationDetail: QUOTATION_DETAIL_MOCK,
            field: ColumnFields.PRICE,
          },
          width: '684px',
        }
      );
    });
  });

  describe('set isLoading', () => {
    test('should set isLoading true', () => {
      component['_isLoading'] = true;
      spectator.setInput('isLoading', true);

      expect(component.isLoading).toBeTruthy();
    });

    test('should set isLoading false', () => {
      component['_isLoading'] = true;
      spectator.setInput('isLoading', false);

      expect(component.isLoading).toBeFalsy();
    });
  });
});
