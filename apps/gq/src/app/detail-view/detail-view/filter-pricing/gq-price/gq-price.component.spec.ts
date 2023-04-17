import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/models';
import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { GqPriceComponent } from './gq-price.component';

describe('GqPriceComponent', () => {
  let component: GqPriceComponent;
  let spectator: Spectator<GqPriceComponent>;

  const createComponent = createComponentFactory({
    component: GqPriceComponent,
    detectChanges: false,
    imports: [
      PushModule,
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.quotationDetail = QUOTATION_DETAIL_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set quotationDetail', () => {
    test('should set quotationDetail, gpi, and gpm', () => {
      const detail = {
        recommendedPrice: 10,
        gpc: 12,
        sqv: 20,
      } as unknown as QuotationDetail;

      jest.spyOn(pricingUtils, 'calculateMargin');

      component.quotationDetail = detail;

      expect(component.quotationDetail).toEqual(detail);
      expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
        detail.recommendedPrice,
        detail.gpc
      );
    });
  });

  describe('selectPrice', () => {
    test('should emit Output EventEmitter with GQ price', () => {
      component.selectGqPrice.emit = jest.fn();
      component.selectPrice();
      const expected = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.recommendedPrice,
        PriceSource.GQ
      );
      expect(component.selectGqPrice.emit).toHaveBeenCalledWith(expected);
    });
    test('should emit Output EventEmitter with strategic price', () => {
      component.selectGqPrice.emit = jest.fn();
      component.quotationDetail.strategicPrice = 10;
      component.quotationDetail.recommendedPrice = undefined;
      component.selectPrice();
      const expected = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.strategicPrice,
        PriceSource.STRATEGIC
      );
      expect(component.selectGqPrice.emit).toHaveBeenCalledWith(expected);
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
