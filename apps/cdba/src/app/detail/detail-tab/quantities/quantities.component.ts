import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QuantitiesDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-quantities',
  templateUrl: './quantities.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class QuantitiesComponent {
  @Input() quantitiesDetails: QuantitiesDetails;

  currentYear = new Date().getFullYear();
}
