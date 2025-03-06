import { Component, Input } from '@angular/core';

import { Customer } from '@gq/shared/models/customer';

@Component({
  selector: 'gq-basic-customer',
  templateUrl: './basic-customer.component.html',
  standalone: false,
})
export class BasicCustomerComponent {
  @Input() customer: Customer;
  @Input() lastYear: number;
  @Input() currentYear: number;
  @Input() userHasAccessToPricingDetails: boolean;
}
