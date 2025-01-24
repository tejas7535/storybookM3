import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let spectator: Spectator<DashboardComponent>;
  const createComponent = createComponentFactory(DashboardComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
