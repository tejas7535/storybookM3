import { Component, Input } from '@angular/core';

import { Customer } from '../../core/store/models';

@Component({
  selector: 'gq-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent {
  @Input() customer: Customer;

  public trackByFn(index: number): number {
    return index;
  }

  customerToArray(customer: Customer): [string, string][] {
    if (customer) {
      const flatCustomer = {
        name: customer.name,
        id: customer.id,
        keyAccount: customer.keyAccount.name,
        subKeyAccount: customer.subKeyAccount.name,
        subRegion: customer.subRegion,
        country: customer.country,
        sectorManagement: customer.sectorManagement,
        subSector: customer.subSector,
      };

      return Object.entries(flatCustomer);
    }

    return [];
  }
}
