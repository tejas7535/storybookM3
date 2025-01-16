import { CommonModule } from '@angular/common';

import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { SimulatedKpiComponent } from './simulated-kpi.component';

describe('SimulatedKpiComponent', () => {
  let component: SimulatedKpiComponent;
  let spectator: Spectator<SimulatedKpiComponent>;

  const createComponent = createComponentFactory({
    component: SimulatedKpiComponent,
    imports: [
      CommonModule,
      provideTranslocoTestingModule({}),
      SharedPipesModule,
    ],
  });
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
