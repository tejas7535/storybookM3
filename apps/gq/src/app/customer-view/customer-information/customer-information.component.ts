import { Component, Input } from '@angular/core';

import { Customer } from '../../core/store/models';

@Component({
  selector: 'gq-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss'],
})
export class CustomerInformationComponent {
  @Input() customer: Customer;
}
