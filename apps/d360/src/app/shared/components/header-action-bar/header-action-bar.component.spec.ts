import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HeaderActionBarComponent } from './header-action-bar.component';

describe('HeaderActionBarComponent', () => {
  let spectator: Spectator<HeaderActionBarComponent>;

  const createComponent = createComponentFactory({
    component: HeaderActionBarComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
