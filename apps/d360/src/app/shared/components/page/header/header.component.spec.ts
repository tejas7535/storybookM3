import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;

  const createComponent = createComponentFactory({
    component: HeaderComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
