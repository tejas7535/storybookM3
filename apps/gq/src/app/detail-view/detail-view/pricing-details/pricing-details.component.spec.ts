import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { MaterialDetailsModule } from './material-details/material-details.module';
import { PricingDetailsComponent } from './pricing-details.component';
import { ProductionCostDetailsComponent } from './production-cost-details/production-cost-details.component';
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
      ReactiveComponentModule,
      SharedPipesModule,
    ],
    providers: [provideMockStore({})],
    declarations: [ProductionCostDetailsComponent, SupplyChainDetailsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observable', () => {
      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();
      expect(component.quotationDetail$).toBeDefined();
    });
  });
});
