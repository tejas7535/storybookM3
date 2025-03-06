import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'cdba-pcm-badge',
  templateUrl: './pcm-badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class PcmBadgeComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() tooltipDisabled = false;
}
