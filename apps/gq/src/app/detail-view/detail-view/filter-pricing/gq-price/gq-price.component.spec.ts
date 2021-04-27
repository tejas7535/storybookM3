import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks/quotation-details.mock';
import { LoadingSpinnerModule } from '../../../../shared/loading-spinner/loading-spinner.module';
import {
  PriceSource,
  UpdatePrice,
} from '../../../../shared/models/quotation-detail';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
import { GqPriceComponent } from './gq-price.component';

describe('GqPriceComponent', () => {
  let component: GqPriceComponent;
  let spectator: Spectator<GqPriceComponent>;
  let router: Router;

  const createComponent = createComponentFactory({
    component: GqPriceComponent,
    detectChanges: false,
    imports: [
      MatCardModule,
      MatIconModule,
      ReactiveComponentModule,
      LoadingSpinnerModule,
      RouterTestingModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
            customer: {
              item: {},
            },
          },
        },
      }),
    ],
    declarations: [GqPriceComponent, FilterPricingCardComponent],
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
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.customerCurrency$).toBeDefined();
      expect(component.gpi).toBeDefined();
    });
    test('should not set gpi', () => {
      component.quotationDetail = undefined;
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.customerCurrency$).toBeDefined();
      expect(component.gpi).toBeUndefined();
    });
  });

  describe('set isLoading', () => {
    test('should set isLoading', () => {
      component._isLoading = false;

      component.isLoading = true;

      expect(component.isLoading).toEqual(false);
    });
    test('should set isLoading', () => {
      component._isLoading = true;

      component.isLoading = true;

      expect(component.isLoading).toEqual(true);
    });
  });
  describe('selectPrice', () => {
    test('should emit Output EventEmitter with GQ price', () => {
      component.selectManualPrice.emit = jest.fn();
      component.selectPrice();
      const expected = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.recommendedPrice,
        PriceSource.GQ
      );
      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(expected);
    });
    test('should emit Output EventEmitter with strategic price', () => {
      component.selectManualPrice.emit = jest.fn();
      component.quotationDetail.strategicPrice = 10;
      component.quotationDetail.recommendedPrice = undefined;
      component.selectPrice();
      const expected = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.strategicPrice,
        PriceSource.STRATEGIC
      );
      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(expected);
    });
  });

  describe('navigateClick', () => {
    test('should navigate to TransactionViewPath', () => {
      spyOn(router, 'navigate');

      component.navigateClick();

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });
});
