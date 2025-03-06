import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { PropertyDelta } from '@gq/core/store/f-pricing/models/property-delta.interface';

@Component({
  selector: 'gq-comparison-delta',
  templateUrl: './comparison-delta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ComparisonDeltaComponent {
  @Input() propertyDeltas: PropertyDelta[];
}
