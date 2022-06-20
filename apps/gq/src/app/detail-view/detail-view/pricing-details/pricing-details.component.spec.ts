import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import {
  MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
  MATERIAL_SALES_ORG_STATE_MOCK,
  PROCESS_CASE_STATE_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { LabelTextModule } from '../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details/material-comparable-cost-details.component';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';
import { ProductionCostDetailsComponent } from './production-cost-details/production-cost-details.component';
import { RelocationCostDetailsComponent } from './relocation-cost-details/relocation-cost-details.component';
import { StockAvailabilityDetailsComponent } from './stock-availability-details/stock-availability-details.component';
import { SupplyChainDetailsComponent } from './supply-chain-details/supply-chain-details.component';

describe('PricingDetailsComponent', () => {
  let component: PricingDetailsComponent;
  let spectator: Spectator<PricingDetailsComponent>;

  const createComponent = createComponentFactory({
    component: PricingDetailsComponent,
    detectChanges: false,
    imports: [
      BrowserAnimationsModule,
      MatCardModule,
      MaterialDetailsModule,
      MatExpansionModule,
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      PushModule,
      LoadingSpinnerModule,
      LabelTextModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          processCase: PROCESS_CASE_STATE_MOCK,
          materialSalesOrg: MATERIAL_SALES_ORG_STATE_MOCK,
          materialComparableCosts: MATERIAL_COMPARABLE_COSTS_STATE_MOCK,
        },
      }),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [
      SupplyChainDetailsComponent,
      ProductionCostDetailsComponent,
      RelocationCostDetailsComponent,
      MaterialComparableCostDetailsComponent,
      StockAvailabilityDetailsComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
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

        m.expect(component.quotationCurrency$).toBeObservable('a', {
          a: QUOTATION_MOCK.currency,
        });
        m.expect(component.materialSalesOrgLoading$).toBeObservable('a', {
          a: MATERIAL_SALES_ORG_STATE_MOCK.materialSalesOrgLoading,
        });
        m.expect(component.materialComparableCostsLoading$).toBeObservable(
          'a',
          {
            a: MATERIAL_COMPARABLE_COSTS_STATE_MOCK.materialComparableCostsLoading,
          }
        );
      })
    );
  });
});
