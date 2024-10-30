import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HelpButtonComponent } from './help-button.component';

describe('HelpButtonComponent', () => {
  let spectator: Spectator<HelpButtonComponent>;

  const createComponent = createComponentFactory({
    component: HelpButtonComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
