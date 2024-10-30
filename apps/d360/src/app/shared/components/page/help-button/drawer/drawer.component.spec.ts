import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { DrawerComponent } from './drawer.component';

describe('DrawerComponent', () => {
  let spectator: Spectator<DrawerComponent>;

  const createComponent = createComponentFactory({
    component: DrawerComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
