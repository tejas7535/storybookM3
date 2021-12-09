import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/models';
import {
  PriceSource,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { QuantityDisplayComponent } from '../quantity/quantity-display/quantity-display.component';
import { GqPriceComponent } from './gq-price.component';

describe('GqPriceComponent', () => {
  let component: GqPriceComponent;
  let spectator: Spectator<GqPriceComponent>;

  const createComponent = createComponentFactory({
    component: GqPriceComponent,
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
      GqPriceComponent,
      FilterPricingCardComponent,
      QuantityDisplayComponent,
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
});
