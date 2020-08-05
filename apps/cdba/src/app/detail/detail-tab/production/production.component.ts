import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductionDetails } from './model/production.details.model';

@Component({
  selector: 'cdba-production',
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductionComponent {
  @Input() productionDetails: ProductionDetails;
  @Input() errorMessage: string;
}
