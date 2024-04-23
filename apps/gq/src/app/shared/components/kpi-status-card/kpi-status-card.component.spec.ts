import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { KpiStatusCardComponent } from './kpi-status-card.component';

describe('KpiStatusCardComponent', () => {
  let component: KpiStatusCardComponent;
  let spectator: Spectator<KpiStatusCardComponent>;

  const createComponent = createComponentFactory({
    imports: [provideTranslocoTestingModule({ en: {} })],
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
