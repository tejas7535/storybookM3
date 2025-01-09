import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MagneticSliderComponent } from './magnetic-slider.component';

describe('MagneticSliderComponent', () => {
  let spectator: Spectator<MagneticSliderComponent>;

  const createComponent = createComponentFactory(MagneticSliderComponent);

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
