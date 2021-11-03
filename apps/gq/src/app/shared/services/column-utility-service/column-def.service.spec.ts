import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ColDef } from '@ag-grid-community/core';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { TranslocoModule } from '@ngneat/transloco';
import { provideMockStore } from '@ngrx/store/testing';

import { updateQuotationDetails } from '../../../core/store';
import { UpdateQuotationDetail } from '../../../core/store/reducers/process-case/models';
import { PriceSource } from '../../models/quotation-detail';
import { ColumnDefService } from './column-def.service';
import { ColumnFields } from './column-fields.enum';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));
describe('ColumnDefService', () => {
  let service: ColumnDefService;
  let spectator: SpectatorService<ColumnDefService>;
  let snackBar: MatSnackBar;

  const createService = createServiceFactory({
    service: ColumnDefService,
    imports: [MatSnackBarModule],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    snackBar = spectator.inject(MatSnackBar);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('selectManualPrice', () => {
    beforeEach(() => {
      service['store'].dispatch = jest.fn();
      snackBar.open = jest.fn();
    });
    test('should dispatch action', () => {
      const price = 10;
      const gqPositionId = '20';
      const updateQuotationDetailList: UpdateQuotationDetail[] = [
        {
          price: 10,
          gqPositionId,
          priceSource: PriceSource.MANUAL,
        },
      ];

      service.selectManualPrice(price, gqPositionId, 1);

      expect(service['store'].dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });

    test('should not dispatch action', () => {
      const price = 0;
      const gqPositionId = '20';

      service.selectManualPrice(price, gqPositionId, 1);

      expect(snackBar.open).toHaveBeenCalled();
      expect(service['store'].dispatch).not.toHaveBeenCalled();
    });
  });

  describe('selectNewQuantity', () => {
    test('should dispatch updateQuotationDetails action', () => {
      service['store'].dispatch = jest.fn();
      const orderQuantity = 10;
      const gqPositionId = '10';
      service.selectNewQuantity(orderQuantity, gqPositionId);

      const updateQuotationDetailList = [
        {
          orderQuantity,
          gqPositionId,
        },
      ];
      expect(service['store'].dispatch).toHaveBeenCalledWith(
        updateQuotationDetails({ updateQuotationDetailList })
      );
    });
  });
  describe('discount valueSetter', () => {
    let discountColumnDef: ColDef;
    beforeEach(() => {
      discountColumnDef = service.COLUMN_DEFS.find(
        (el) => el.field === ColumnFields.DISCOUNT
      );
      service.selectManualPrice = jest.fn();
    });
    test('should call selectManualPrice', () => {
      if (typeof discountColumnDef.valueSetter !== 'string') {
        discountColumnDef.valueSetter({
          newValue: '10.00',
          data: { sapGrossPrice: 100, material: { priceUnit: 1 } },
        } as any);
      }
      expect(service.selectManualPrice).toHaveBeenCalledTimes(1);
    });
    test('should not call selectManualPrice', () => {
      if (typeof discountColumnDef.valueSetter !== 'string') {
        discountColumnDef.valueSetter({} as any);
      }
      expect(service.selectManualPrice).toHaveBeenCalledTimes(0);
    });
  });
  describe('quantity valueSetter', () => {
    let quantityColumnDef: ColDef;
    beforeEach(() => {
      quantityColumnDef = service.COLUMN_DEFS.find(
        (el) => el.field === ColumnFields.ORDER_QUANTITY
      );
      service.selectNewQuantity = jest.fn();
    });
    test('should select new Quantity', () => {
      if (typeof quantityColumnDef.valueSetter !== 'string') {
        quantityColumnDef.valueSetter({
          newValue: 15,
          data: { gqPositionId: '10' },
        } as any);
      }
      expect(service.selectNewQuantity).toHaveBeenCalledTimes(1);
      expect(service.selectNewQuantity).toHaveBeenLastCalledWith(15, '10');
    });
    test('should not select new Quantity', () => {
      if (typeof quantityColumnDef.valueSetter !== 'string') {
        quantityColumnDef.valueSetter({} as any);
      }
      expect(service.selectNewQuantity).toHaveBeenCalledTimes(0);
    });
  });
  describe('price valueSetter', () => {
    let priceColumnDef: ColDef;
    beforeEach(() => {
      priceColumnDef = service.COLUMN_DEFS.find(
        (el) => el.field === ColumnFields.PRICE
      );
      service.selectManualPrice = jest.fn();
    });
    test('should selectManualPrice', () => {
      const newValue = '15';
      const gqPositionId = '10';
      const priceUnit = 1;
      if (typeof priceColumnDef.valueSetter !== 'string') {
        priceColumnDef.valueSetter({
          newValue: '15',
          data: { gqPositionId: '10', material: { priceUnit: 1 } },
        } as any);
      }
      expect(service.selectManualPrice).toHaveBeenCalledTimes(1);
      expect(service.selectManualPrice).toHaveBeenLastCalledWith(
        Number.parseFloat(newValue),
        gqPositionId,
        priceUnit
      );
    });
    test('should not selectManualPrice', () => {
      if (typeof priceColumnDef.valueSetter !== 'string') {
        priceColumnDef.valueSetter({} as any);
      }
      expect(service.selectManualPrice).toHaveBeenCalledTimes(0);
    });
  });
});
