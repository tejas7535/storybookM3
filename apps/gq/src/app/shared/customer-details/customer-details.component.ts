import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../app-route-path.enum';
import { Customer } from '../../core/store/models';

@Component({
  selector: 'gq-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent {
  @Input() customer: Customer;

  constructor(private readonly router: Router) {}

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
        sectorManagement: customer.sectorManagement.id,
        subSector: customer.subSector.id,
      };

      return Object.entries(flatCustomer);
    }

    return [];
  }

  openCustomer(): void {
    this.router.navigate([AppRoutePath.CustomerViewPath], {
      queryParamsHandling: 'preserve',
    });
  }
}
