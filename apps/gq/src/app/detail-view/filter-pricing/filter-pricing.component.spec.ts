import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { updateQuotationDetails } from '../../core/store';
import { PriceSource, UpdatePrice } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
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
      provideTranslocoTestingModule({}),
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
      component['subscription'].add = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.manualPricePermission$).toBeDefined();
      expect(component['subscription'].add).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('selectManualPrice', () => {
    test('should dispatch action', () => {
      component.gqPositionId = '1234';
      mockStore.dispatch = jest.fn();
      const updatePrice = new UpdatePrice(10, PriceSource.GQ);
      component.selectManualPrice(updatePrice);

      expect(mockStore.dispatch).toHaveBeenLastCalledWith(
        updateQuotationDetails({
          updateQuotationDetailList: [
            {
              gqPositionId: '1234',
              price: 10,
              priceSource: PriceSource.GQ,
            },
          ],
        })
      );
    });
  });
});
