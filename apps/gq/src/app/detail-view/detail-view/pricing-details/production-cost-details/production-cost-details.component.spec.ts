import { MatCardModule } from '@angular/material/card';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../../../shared/components/label-text/label-text.module';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { ProductionCostDetailsComponent } from './production-cost-details.component';

describe('ProductionCostDetailsComponent', () => {
  let component: ProductionCostDetailsComponent;
  let spectator: Spectator<ProductionCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: ProductionCostDetailsComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      SharedPipesModule,
      MatCardModule,
      LabelTextModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
