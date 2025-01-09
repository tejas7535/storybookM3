import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'mm-magnetic-slider',
  templateUrl: './magnetic-slider.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MagneticSliderComponent {}
