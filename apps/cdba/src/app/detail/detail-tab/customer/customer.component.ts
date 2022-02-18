import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CustomerDetails } from '@cdba/shared/models';

@Component({
  selector: 'cdba-customer',
  templateUrl: './customer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerComponent {
  @Input() customerDetails: CustomerDetails;
}
