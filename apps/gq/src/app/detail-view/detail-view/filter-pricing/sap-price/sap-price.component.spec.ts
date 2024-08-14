import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { SapConditionType } from '@gq/core/store/reducers/sap-price-details/models';
import {
  PriceSource,
  SapPriceCondition,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import { PriceSourcePipe } from '@gq/shared/pipes/price-source/price-source.pipe';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { SapPriceComponent } from './sap-price.component';

describe('SapPriceComponent', () => {
  let component: SapPriceComponent;
  let spectator: Spectator<SapPriceComponent>;

  const createComponent = createComponentFactory({
    component: SapPriceComponent,
    detectChanges: false,
    imports: [
      PushPipe,
      PriceSourcePipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set quotationDetail', () => {
    test('should not set gpi/gpm', () => {
      component.quotationDetail = undefined;

      expect(component.gpi).toBeUndefined();
      expect(component.gpm).toBeUndefined();
    });

    test('should set gpi/gpm', () => {
      jest.spyOn(pricingUtils, 'calculateMargin').mockImplementation(() => 5);
      component.quotationDetail = QUOTATION_DETAIL_MOCK;

      expect(component.gpi).toEqual(5);
      expect(component.gpm).toEqual(5);
      expect(component.gpmRfq).toEqual(5);
      expect(pricingUtils.calculateMargin).toBeCalledTimes(3);
    });

    test('should set isSelected', () => {
      spectator.setInput('quotationDetail', {
        ...QUOTATION_DETAIL_MOCK,
        priceSource: PriceSource.CAP_PRICE,
      });
      spectator.detectChanges();
      expect(component.isSelected).toBeTruthy();

      spectator.setInput('quotationDetail', {
        ...QUOTATION_DETAIL_MOCK,
        priceSource: PriceSource.SAP_SPECIAL,
      });
      spectator.detectChanges();
      expect(component.isSelected).toBeTruthy();

      spectator.setInput('quotationDetail', {
        ...QUOTATION_DETAIL_MOCK,
        priceSource: PriceSource.SAP_STANDARD,
      });
      spectator.detectChanges();
      expect(component.isSelected).toBeTruthy();

      spectator.setInput('quotationDetail', {
        ...QUOTATION_DETAIL_MOCK,
        priceSource: PriceSource.GQ,
      });
      spectator.detectChanges();
      expect(component.isSelected).toBeFalsy();
    });
    test('should not set isSelected', () => {
      component.quotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        priceSource: PriceSource.MANUAL,
      };
      component.isSelected = true;

      spectator.setInput('isLoading', true);

      expect(component.isSelected).toBeTruthy();
    });
  });

  describe('selectPrice', () => {
    test('should emit Output EventEmitter with sap price standard', () => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      component.selectSapPrice.emit = jest.fn();

      component.selectPrice();

      expect(component.selectSapPrice.emit).toHaveBeenCalledWith(
        new UpdatePrice(
          QUOTATION_DETAIL_MOCK.sapPrice,
          PriceSource.SAP_STANDARD
        )
      );
    });
    test('should emit Output EventEmitter with sector discount', () => {
      component.quotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        leadingSapConditionType: SapConditionType.ZSEK,
      };
      component.selectSapPrice.emit = jest.fn();

      component.selectPrice();

      expect(component.selectSapPrice.emit).toHaveBeenCalledWith(
        new UpdatePrice(
          QUOTATION_DETAIL_MOCK.sapPrice,
          PriceSource.SECTOR_DISCOUNT
        )
      );
    });
    test('should emit Output EventEmitter with sap price special', () => {
      component.selectSapPrice.emit = jest.fn();
      component.quotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        sapPriceCondition: SapPriceCondition.SPECIAL_ZP17,
      };
      component.selectPrice();

      expect(component.selectSapPrice.emit).toHaveBeenCalledWith(
        new UpdatePrice(QUOTATION_DETAIL_MOCK.sapPrice, PriceSource.SAP_SPECIAL)
      );
    });
    test('should emit Output EventEmitter with cap price', () => {
      component.selectSapPrice.emit = jest.fn();
      component.quotationDetail = {
        ...QUOTATION_DETAIL_MOCK,
        sapPriceCondition: SapPriceCondition.CAP_PRICE,
      };
      component.selectPrice();

      expect(component.selectSapPrice.emit).toHaveBeenCalledWith(
        new UpdatePrice(QUOTATION_DETAIL_MOCK.sapPrice, PriceSource.CAP_PRICE)
      );
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });

  describe('set isLoading', () => {
    test('should set isLoading true', () => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['_isLoading'] = true;
      spectator.setInput('isLoading', true);

      expect(component.isLoading).toBeTruthy();
    });

    test('should set isLoading false', () => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      component['_isLoading'] = true;
      spectator.setInput('isLoading', false);

      expect(component.isLoading).toBeFalsy();
    });
  });
});
