import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { KpiItemComponent } from './kpi-item.component';

describe('KpiItemComponent', () => {
  let component: KpiItemComponent;
  let spectator: Spectator<KpiItemComponent>;

  const createComponent = createComponentFactory({
    component: KpiItemComponent,
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
