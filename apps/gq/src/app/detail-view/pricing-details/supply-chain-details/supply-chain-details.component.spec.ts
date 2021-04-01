import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { PlantDisplayPipe } from '../../../shared/pipes/plant-display.pipe';
import { ProductionCostDetailsComponent } from '../production-cost-details/production-cost-details.component';
import { SupplyChainDetailsComponent } from './supply-chain-details.component';

describe('SupplyChainDetailsComponent', () => {
  let component: SupplyChainDetailsComponent;
  let spectator: Spectator<SupplyChainDetailsComponent>;

  const createComponent = createComponentFactory({
    component: SupplyChainDetailsComponent,
    imports: [provideTranslocoTestingModule({}), ReactiveComponentModule],
    declarations: [
      SupplyChainDetailsComponent,
      ProductionCostDetailsComponent,
      PlantDisplayPipe,
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
