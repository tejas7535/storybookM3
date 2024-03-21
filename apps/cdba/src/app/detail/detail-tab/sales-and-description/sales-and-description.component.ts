import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SalesDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-sales-and-description',
  templateUrl: './sales-and-description.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesAndDescriptionComponent {
  @Input() salesDetails: SalesDetails;

  headers: { label: string }[] = [
    { label: 'description' },
    { label: 'organizations' },
  ];
}
