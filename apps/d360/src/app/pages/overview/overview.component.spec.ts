import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { OverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let spectator: Spectator<OverviewComponent>;
  const createComponent = createComponentFactory(OverviewComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
