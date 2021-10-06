import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QuantitiesDetails } from './model/quantities.model';

@Component({
  selector: 'cdba-quantities',
  templateUrl: './quantities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitiesComponent {
  @Input() quantitiesDetails: QuantitiesDetails;

  currentYear = new Date().getFullYear();
}
