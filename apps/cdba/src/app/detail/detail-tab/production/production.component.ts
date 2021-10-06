import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductionDetails } from './model/production.details.model';

@Component({
  selector: 'cdba-production',
  templateUrl: './production.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionComponent {
  @Input() productionDetails: ProductionDetails;
}
