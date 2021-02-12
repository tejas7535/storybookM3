import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { updateQuotationDetails } from '../core/store';
import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';
import { CaseHeaderModule } from '../shared/case-header/case-header.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { OfferDrawerModule } from '../shared/offer-drawer/offer-drawer.module';
import { DetailViewComponent } from './detail-view.component';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let spectator: Spectator<DetailViewComponent>;
  let mockStore: MockStore<ProcessCaseState>;

  const createComponent = createComponentFactory({
    component: DetailViewComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      CaseHeaderModule,
      FilterPricingModule,
      OfferDrawerModule,
      MatButtonModule,
      MatCardModule,
      MatSidenavModule,
      PricingDetailsModule,
      LoadingSpinnerModule,
      ReactiveComponentModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          detailCase: {
            detailCase: {},
          },
          processCase: {
            quotation: {},
          },
        },
      }),
    ],
    declarations: [DetailViewComponent],
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

      expect(component.quotation$).toBeDefined();
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
  describe('getOffer', () => {
    test('set offer', () => {
      component.getOffer();
      expect(component.offer$).toBeDefined();
    });
  });

  describe('selectManualPrice', () => {
    test('should dispatch action', () => {
      component.gqPositionId = '1234';
      mockStore.dispatch = jest.fn();

      component.selectManualPrice(10);

      expect(mockStore.dispatch).toHaveBeenLastCalledWith(
        updateQuotationDetails({
          quotationDetailIDs: [
            {
              gqPositionId: '1234',
              price: 10,
            },
          ],
        })
      );
    });
  });
});
