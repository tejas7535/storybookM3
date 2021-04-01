import { MatCardModule } from '@angular/material/card';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';

import { UnderConstructionModule } from '@schaeffler/empty-states';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { LoadingSpinnerModule } from '../../shared/loading-spinner/loading-spinner.module';
import { SharedModule } from '../../shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { DetailTabComponent } from './detail-tab.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { PricingModule } from './pricing/pricing.module';
import { ProductionModule } from './production/production.module';
import { QuantitiesModule } from './quantities/quantities.module';
import { SalesAndDescriptionModule } from './sales-and-description/sales-and-description.module';

describe('DetailTabComponent', () => {
  let spectator: Spectator<DetailTabComponent>;
  let component: DetailTabComponent;

  const createComponent = createComponentFactory({
    component: DetailTabComponent,
    imports: [
      SharedModule,
      provideTranslocoTestingModule({}),
      MatCardModule,
      CustomerModule,
      DimensionAndWeightModule,
      PricingModule,
      ProductionModule,
      QuantitiesModule,
      SalesAndDescriptionModule,
      UnderConstructionModule,
      LoadingSpinnerModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set observables', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.isLoading$).toBeDefined();
      expect(component.errorMessageDetails$).toBeDefined();
      expect(component.customerDetails$).toBeDefined();
      expect(component.dimensionAndWeight$).toBeDefined();
      expect(component.salesPrice$).toBeDefined();
      expect(component.productionDetails$).toBeDefined();
      expect(component.quantitiesDetails$).toBeDefined();
      expect(component.salesDetails$).toBeDefined();
    });
  });
});
