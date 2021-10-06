import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SalesDetails } from './model/sales-details.model';

@Component({
  selector: 'cdba-sales-and-description',
  templateUrl: './sales-and-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesAndDescriptionComponent {
  @Input() salesDetails: SalesDetails;
}
