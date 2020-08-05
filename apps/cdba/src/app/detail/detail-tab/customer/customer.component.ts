import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CustomerDetails } from './model/customer.details.model';

@Component({
  selector: 'cdba-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerComponent {
  @Input() customerDetails: CustomerDetails;
  @Input() errorMessage: string;
}
