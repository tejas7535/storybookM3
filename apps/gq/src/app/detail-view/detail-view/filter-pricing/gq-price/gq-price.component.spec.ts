import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { GqPriceComponent } from './gq-price.component';

describe('GqPriceComponent', () => {
  let component: GqPriceComponent;
  let spectator: Spectator<GqPriceComponent>;

  const createComponent = createComponentFactory({
    component: GqPriceComponent,
    detectChanges: false,
    imports: [
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
    ],
    declarations: [MockPipe(NumberCurrencyPipe), MockPipe(PercentagePipe)],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput('quotationDetail', QUOTATION_DETAIL_MOCK);
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set quotationDetail', () => {
    test('should set quotationDetail, gpi, and gpm', () => {
      const detail = {
        recommendedPrice: 15,
        gpc: 12,
        sqv: 9,
      } as unknown as QuotationDetail;

      jest.spyOn(pricingUtils, 'calculateMargin');

      spectator.setInput('quotationDetail', detail);

      expect(component.quotationDetail()).toEqual(detail);
      expect(component.gpi()).toEqual(0.2);
      expect(component.gpm()).toEqual(0.4);
    });

    test('should set gpmRfq when RFQ data is present', () => {
      const detail = {
        recommendedPrice: 10,
        gpc: 12,
        sqv: 20,
        rfqData: {
          sqv: 30,
        },
      } as unknown as QuotationDetail;

      jest.spyOn(pricingUtils, 'calculateMargin');

      spectator.setInput('quotationDetail', detail);

      expect(component.quotationDetail()).toEqual(detail);
      expect(component.gpmRfq()).toEqual(-2);
    });
    test('should set gpmRfq to undefined when RFQ data is not present', () => {
      const detail = {
        recommendedPrice: 10,
        gpc: 12,
        sqv: 20,
      } as unknown as QuotationDetail;

      jest.spyOn(pricingUtils, 'calculateMargin');

      spectator.setInput('quotationDetail', detail);

      expect(component.quotationDetail()).toEqual(detail);
      expect(component.gpmRfq()).toBeUndefined();
    });
    test('should set isSelected to true on gq priceSource', () => {
      const detail = {
        priceSource: PriceSource.GQ,
      } as unknown as QuotationDetail;

      spectator.setInput('quotationDetail', detail);
      expect(component.isSelected()).toBeTruthy();
    });
    test('should set isSelected to true on strategic priceSource', () => {
      const detail = {
        priceSource: PriceSource.STRATEGIC,
      } as unknown as QuotationDetail;

      spectator.setInput('quotationDetail', detail);
      expect(component.isSelected()).toBeTruthy();
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
      component.quotationDetail().strategicPrice = 10;
      component.quotationDetail().recommendedPrice = undefined;
      component.selectPrice();
      const expected = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.strategicPrice,
        PriceSource.STRATEGIC
      );
      expect(component.selectGqPrice.emit).toHaveBeenCalledWith(expected);
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
