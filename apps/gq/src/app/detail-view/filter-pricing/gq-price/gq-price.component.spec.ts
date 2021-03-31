import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks/quotation-details.mock';
import { PriceSource, UpdatePrice } from '../../../core/store/models';
import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import { FilterPricingCardComponent } from '../filter-pricing-card/filter-pricing-card.component';
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
      provideTranslocoTestingModule({}),
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
    test('should emit Output EventEmitter with fixed price', () => {
      component.selectManualPrice.emit = jest.fn();
      component.quotationDetail.fixedPrice = 10;
      component.quotationDetail.recommendedPrice = undefined;
      component.selectPrice();
      const expected = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.fixedPrice,
        PriceSource.FIXED
      );
      expect(component.selectManualPrice.emit).toHaveBeenCalledWith(expected);
    });
  });
});
