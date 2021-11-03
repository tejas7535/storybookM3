import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { MaterialComparableCostDetailsComponent } from './material-comparable-cost-details/material-comparable-cost-details.component';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';
import { ProductionCostDetailsComponent } from './production-cost-details/production-cost-details.component';
import { RelocationCostDetailsComponent } from './relocation-cost-details/relocation-cost-details.component';
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
      ReactiveComponentModule,
      LoadingSpinnerModule,
      LabelTextModule,
    ],
    providers: [
      provideMockStore({}),
      { provide: MATERIAL_SANITY_CHECKS, useValue: false },
    ],
    declarations: [
      SupplyChainDetailsComponent,
      ProductionCostDetailsComponent,
      RelocationCostDetailsComponent,
      MaterialComparableCostDetailsComponent,
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
