import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';
import { ProductionCostDetailsComponent } from '../production-cost-details/production-cost-details.component';
import { SupplyChainDetailsComponent } from './supply-chain-details.component';

describe('SupplyChainDetailsComponent', () => {
  let component: SupplyChainDetailsComponent;
  let spectator: Spectator<SupplyChainDetailsComponent>;

  const createComponent = createComponentFactory({
    component: SupplyChainDetailsComponent,
    imports: [
      provideTranslocoTestingModule({}),
      ReactiveComponentModule,
      SharedPipesModule,
    ],
    declarations: [SupplyChainDetailsComponent, ProductionCostDetailsComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
