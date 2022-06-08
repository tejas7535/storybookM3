import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockComponent } from 'ng-mocks';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import {
  PriceSource,
  SapPriceCondition,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { DetailButtonComponent } from '../detail-button/detail-button.component';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { QuantityDisplayComponent } from '../quantity/quantity-display/quantity-display.component';
import { SapPriceComponent } from './sap-price.component';

describe('SapPriceComponent', () => {
  let component: SapPriceComponent;
  let spectator: Spectator<SapPriceComponent>;

  const createComponent = createComponentFactory({
    component: SapPriceComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      PushModule,
      LoadingSpinnerModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      SapPriceComponent,
      MockComponent(FilterPricingCardComponent),
      MockComponent(QuantityDisplayComponent),
      MockComponent(DetailButtonComponent),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    component.quotationDetail = QUOTATION_DETAIL_MOCK;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should define observables', () => {
      component.ngOnInit();

      expect(component.gpi).toBeDefined();
      expect(component.gpm).toBeDefined();
    });
    test('should not set gpi', () => {
      component.quotationDetail = undefined;

      component.ngOnInit();

      expect(component.gpi).toBeUndefined();
      expect(component.gpm).toBeUndefined();
    });
  });

  describe('ngOnChanges', () => {
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
  describe('set isLoading', () => {
    test('should set isLoading false', () => {
      component._isLoading = false;

      component.isLoading = true;

      expect(component.isLoading).toEqual(false);
    });
    test('should set isLoading true', () => {
      component._isLoading = true;

      component.isLoading = true;

      expect(component.isLoading).toEqual(true);
    });
  });
  describe('selectPrice', () => {
    test('should emit Output EventEmitter with sap price standard', () => {
      component.selectSapPrice.emit = jest.fn();

      component.selectPrice();

      expect(component.selectSapPrice.emit).toHaveBeenCalledWith(
        new UpdatePrice(
          QUOTATION_DETAIL_MOCK.sapPrice,
          PriceSource.SAP_STANDARD
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
});
