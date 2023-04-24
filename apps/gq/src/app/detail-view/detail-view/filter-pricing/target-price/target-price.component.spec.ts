import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import {
  PriceSource,
  QuotationDetail,
  UpdatePrice,
} from '@gq/shared/models/quotation-detail';
import { NumberCurrencyPipe } from '@gq/shared/pipes/number-currency/number-currency.pipe';
import { PercentagePipe } from '@gq/shared/pipes/percentage/percentage.pipe';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { TargetPriceComponent } from './target-price.component';

describe('TargetPriceComponent', () => {
  let component: TargetPriceComponent;
  let spectator: Spectator<TargetPriceComponent>;

  const createComponent = createComponentFactory({
    component: TargetPriceComponent,
    detectChanges: false,
    imports: [PushModule, provideTranslocoTestingModule({ en: {} })],
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

  test('should set quotationDetail, gpi and gpm', () => {
    const quotationDetail = {
      targetPrice: 10,
      gpc: 12,
      sqv: 20,
    } as unknown as QuotationDetail;

    jest.spyOn(pricingUtils, 'calculateMargin');

    component.quotationDetail = quotationDetail;

    expect(component.quotationDetail).toEqual(quotationDetail);
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.gpc
    );
    expect(pricingUtils.calculateMargin).toHaveBeenCalledWith(
      quotationDetail.targetPrice,
      quotationDetail.sqv
    );
    expect(pricingUtils.calculateMargin).toBeCalledTimes(2);
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

  test('should emit targetPriceSelected event with the correct target price', () => {
    component.targetPriceSelected.emit = jest.fn();
    component.selectTargetPrice();
    const expectedUpdatePrice = new UpdatePrice(
      QUOTATION_DETAIL_MOCK.targetPrice,
      PriceSource.TARGET_PRICE
    );

    expect(component.isLoading).toBeTruthy();
    expect(component.targetPriceSelected.emit).toHaveBeenCalledWith(
      expectedUpdatePrice
    );
  });
});
