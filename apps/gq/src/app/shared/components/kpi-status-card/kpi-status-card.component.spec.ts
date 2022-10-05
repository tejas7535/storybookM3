import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { KpiStatusCardComponent } from './kpi-status-card.component';

describe('KpiStatusCardComponent', () => {
  let component: KpiStatusCardComponent;
  let spectator: Spectator<KpiStatusCardComponent>;

  const createComponent = createComponentFactory({
    component: KpiStatusCardComponent,
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
