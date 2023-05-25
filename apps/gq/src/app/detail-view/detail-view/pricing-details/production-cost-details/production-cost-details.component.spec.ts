import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ProductionCostDetailsComponent } from './production-cost-details.component';

describe('ProductionCostDetailsComponent', () => {
  let component: ProductionCostDetailsComponent;
  let spectator: Spectator<ProductionCostDetailsComponent>;

  const createComponent = createComponentFactory({
    component: ProductionCostDetailsComponent,
    imports: [provideTranslocoTestingModule({ en: {} }), SharedPipesModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
