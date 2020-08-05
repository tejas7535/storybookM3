import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { QuantitiesDetails } from './model/quantities.model';

@Component({
  selector: 'cdba-quantities',
  templateUrl: './quantities.component.html',
  styleUrls: ['./quantities.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitiesComponent {
  @Input() quantitiesDetails: QuantitiesDetails;
  @Input() errorMessage: string;

  currentYear = new Date().getFullYear();
}
