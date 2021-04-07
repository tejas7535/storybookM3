import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'mm-magnetic-slider-card',
  templateUrl: './magnetic-slider-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'snap-start' },
})
export class MagneticSliderCardComponent {
  @Input() title?: string;

  @Input() buttonText?: string;

  @Input() buttonAction?: void;
}
