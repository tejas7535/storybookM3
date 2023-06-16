import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { MagneticSliderComponent } from './magnetic-slider.component';

describe('MagneticSliderComponent', () => {
  let component: MagneticSliderComponent;
  let spectator: Spectator<MagneticSliderComponent>;

  const createComponent = createComponentFactory({
    component: MagneticSliderComponent,
    imports: [],
    declarations: [MagneticSliderComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
