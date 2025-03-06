import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DimensionAndWeightDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-dimension-and-weight',
  templateUrl: './dimension-and-weight.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DimensionAndWeightComponent {
  @Input() dimensionAndWeightDetails: DimensionAndWeightDetails;
}
