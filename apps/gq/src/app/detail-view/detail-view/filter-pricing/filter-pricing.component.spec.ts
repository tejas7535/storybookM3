import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ActiveCaseActions } from '@gq/core/store/active-case/active-case.action';
import { ProcessCaseState } from '@gq/core/store/process-case';
import * as pricingUtils from '@gq/shared/utils/pricing.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  AUTH_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { ACTIVE_CASE_STATE_MOCK } from '../../../../testing/mocks/state/active-case-state.mock';
import {
  PriceSource,
  UpdatePrice,
} from '../../../shared/models/quotation-detail';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { FilterPricingComponent } from './filter-pricing.component';
import { FilterPricingCardComponent } from './filter-pricing-card/filter-pricing-card.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';
import { QuantityDisplayComponent } from './quantity/quantity-display/quantity-display.component';
import { TargetPriceComponent } from './target-price/target-price.component';

describe('FilterPricingComponent', () => {
  let component: FilterPricingComponent;
  let spectator: Spectator<FilterPricingComponent>;
  let mockStore: MockStore<ProcessCaseState>;

  const createComponent = createComponentFactory({
    component: FilterPricingComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      LoadingSpinnerModule,
      MatCardModule,
      MatIconModule,
      MatFormFieldModule,
      MatInputModule,
      PushModule,
      ReactiveFormsModule,
      SharedPipesModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          activeCase: ACTIVE_CASE_STATE_MOCK,
          'azure-auth': AUTH_STATE_MOCK,
        },
      }),
    ],
    declarations: [
      FilterPricingComponent,
      FilterPricingCardComponent,
      ManualPriceComponent,
      GqPriceComponent,
      QuantityDisplayComponent,
      TargetPriceComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    mockStore = spectator.inject(MockStore);

    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should initalize observables',
      marbles((m) => {
        component.ngOnInit();

        m.expect(component.quotationCurrency$).toBeObservable(
          m.cold('a', { a: QUOTATION_MOCK.currency })
        );
        m.expect(component.updateIsLoading$).toBeObservable('a', {
          a: ACTIVE_CASE_STATE_MOCK.updateLoading,
        });
        m.expect(component.userHasGPCRole$).toBeObservable('a', {
          a: true,
        });
        m.expect(component.userHasSQVRole$).toBeObservable('a', {
          a: true,
        });
        m.expect(component.userHasManualPriceRole$).toBeObservable('a', {
          a: true,
        });
      })
    );
  });

  describe('selectManualPrice', () => {
    test('should dispatch action', () => {
      const PRICE_UNIT = 100;
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      jest.spyOn(pricingUtils, 'getPriceUnit').mockReturnValue(PRICE_UNIT);
      mockStore.dispatch = jest.fn();
      const updatePrice = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.recommendedPrice,
        PriceSource.GQ
      );
      component.selectPrice(updatePrice);

      expect(pricingUtils.getPriceUnit).toHaveBeenCalledTimes(1);
      expect(pricingUtils.getPriceUnit).toHaveBeenCalledWith(
        QUOTATION_DETAIL_MOCK
      );
      expect(mockStore.dispatch).toHaveBeenLastCalledWith(
        ActiveCaseActions.updateQuotationDetails({
          updateQuotationDetailList: [
            {
              gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
              price: QUOTATION_DETAIL_MOCK.recommendedPrice / PRICE_UNIT,
              priceSource: PriceSource.GQ,
            },
          ],
        })
      );
    });
  });
});
