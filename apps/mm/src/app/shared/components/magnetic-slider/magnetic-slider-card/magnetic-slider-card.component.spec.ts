import { MatCardModule } from '@angular/material/card';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { MagneticSliderCardComponent } from './magnetic-slider-card.component';

describe('MagneticSliderCardComponent', () => {
  let component: MagneticSliderCardComponent;
  let spectator: Spectator<MagneticSliderCardComponent>;

  const createComponent = createComponentFactory({
    component: MagneticSliderCardComponent,
    imports: [MatCardModule],
    declarations: [MagneticSliderCardComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
