import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { ProductionCostDetailsComponent } from './production-cost-details.component';

describe('ProductionCostDetailsComponent', () => {
  let component: ProductionCostDetailsComponent;
  let spectator: Spectator<ProductionCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: ProductionCostDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
