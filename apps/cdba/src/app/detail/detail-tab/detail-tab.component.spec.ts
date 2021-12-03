import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { DETAIL_STATE_MOCK } from '@cdba/testing/mocks';

import { CustomerModule } from './customer/customer.module';
import { DetailTabComponent } from './detail-tab.component';
import { DimensionAndWeightModule } from './dimension-and-weight/dimension-and-weight.module';
import { DrawingsModule } from './drawings/drawings.module';
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
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      MatCardModule,
      CustomerModule,
      DimensionAndWeightModule,
      PricingModule,
      ProductionModule,
      QuantitiesModule,
      SalesAndDescriptionModule,
      MockModule(DrawingsModule),
      LoadingSpinnerModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          detail: DETAIL_STATE_MOCK,
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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
      component.ngOnInit();

      expect(component.isLoading$).toBeDefined();
      expect(component.customerDetails$).toBeDefined();
      expect(component.dimensionAndWeight$).toBeDefined();
      expect(component.salesPrice$).toBeDefined();
      expect(component.productionDetails$).toBeDefined();
      expect(component.quantitiesDetails$).toBeDefined();
      expect(component.salesDetails$).toBeDefined();
    });
  });
});
