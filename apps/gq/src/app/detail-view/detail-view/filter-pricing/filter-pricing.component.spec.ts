import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { QUOTATION_DETAIL_MOCK } from '../../../../testing/mocks';
import { updateQuotationDetails } from '../../../core/store';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { LoadingSpinnerModule } from '../../../shared/loading-spinner/loading-spinner.module';
import {
  PriceSource,
  UpdatePrice,
} from '../../../shared/models/quotation-detail';
import { FilterPricingCardComponent } from './filter-pricing-card/filter-pricing-card.component';
import { FilterPricingComponent } from './filter-pricing.component';
import { GqPriceComponent } from './gq-price/gq-price.component';
import { ManualPriceComponent } from './manual-price/manual-price.component';

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
      ReactiveComponentModule,
      ReactiveFormsModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: {
            quotation: {},
          },
        },
      }),
    ],
    declarations: [
      FilterPricingComponent,
      FilterPricingCardComponent,
      ManualPriceComponent,
      GqPriceComponent,
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
    test('should define observables', () => {
      component.ngOnInit();

      expect(component.userHasManualPriceRole$).toBeDefined();
    });
  });

  describe('selectManualPrice', () => {
    test('should dispatch action', () => {
      component.quotationDetail = QUOTATION_DETAIL_MOCK;
      mockStore.dispatch = jest.fn();
      const updatePrice = new UpdatePrice(
        QUOTATION_DETAIL_MOCK.recommendedPrice,
        PriceSource.GQ
      );
      component.selectManualPrice(updatePrice);

      expect(mockStore.dispatch).toHaveBeenLastCalledWith(
        updateQuotationDetails({
          updateQuotationDetailList: [
            {
              gqPositionId: QUOTATION_DETAIL_MOCK.gqPositionId,
              price: QUOTATION_DETAIL_MOCK.recommendedPrice,
              priceSource: PriceSource.GQ,
            },
          ],
        })
      );
    });
  });
});
