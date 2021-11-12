import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import {
  PriceSource,
  SapPriceCondition,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { QuantityDisplayComponent } from '../quantity/quantity-display/quantity-display.component';
import { SapPriceComponent } from './sap-price.component';

describe('SapPriceComponent', () => {
  let component: SapPriceComponent;
  let spectator: Spectator<SapPriceComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: SapPriceComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      ReactiveComponentModule,
      LoadingSpinnerModule,
      RouterTestingModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    declarations: [
      SapPriceComponent,
      FilterPricingCardComponent,
      QuantityDisplayComponent,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    router = spectator.inject(Router);
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
  });

  describe('navigateClick', () => {
    test('should navigate to TransactionViewPath', () => {
      router.navigate = jest.fn();

      component.navigateClick();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(3);

      expect(result).toEqual(3);
    });
  });
});
