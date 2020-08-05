import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DimensionAndWeightDetails } from './model/dimension-and-weight-details.model';

@Component({
  selector: 'cdba-dimension-and-weight',
  templateUrl: './dimension-and-weight.component.html',
  styleUrls: ['./dimension-and-weight.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DimensionAndWeightComponent {
  @Input() dimensionAndWeight: DimensionAndWeightDetails;
  @Input() errorMessage: string;
}
