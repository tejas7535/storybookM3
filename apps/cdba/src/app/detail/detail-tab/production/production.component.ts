import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductionDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-production',
  templateUrl: './production.component.html',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionComponent {
  @Input() productionDetails: ProductionDetails;
}
