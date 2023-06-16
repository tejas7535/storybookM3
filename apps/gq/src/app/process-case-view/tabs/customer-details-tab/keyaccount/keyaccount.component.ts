import { Component, Input } from '@angular/core';

import { Customer } from '@gq/shared/models/customer';

@Component({
  selector: 'gq-keyaccount',
  templateUrl: './keyaccount.component.html',
})
export class KeyaccountComponent {
  @Input() customer: Customer;
  @Input() lastYear: number;
  @Input() currentYear: number;
}
