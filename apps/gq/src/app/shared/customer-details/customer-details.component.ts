import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../app-route-path.enum';
import { Customer } from '../../core/store/models';
import { HelperService } from '../services/helper-service/helper-service.service';

@Component({
  selector: 'gq-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit {
  @Input() customer: Customer;
  public lastYear: number;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.lastYear = HelperService.getLastYear();
  }

  public trackByFn(index: number): number {
    return index;
  }

  customerToArray(customer: Customer): [string, string][] {
    if (customer) {
      const flatCustomer = {
        name: customer.name,
        keyAccount: customer.keyAccount,
        id: customer.identifiers.customerId,
        subKeyAccount: customer.subKeyAccount,
        classification: customer.abcClassification,
        sectorManagement: customer.sectorManagement,
        // TODO: Data will be provided in the table in the future, this are placeholders for now
        lastYearNetSales: undefined,
        lastYearGPI: undefined,
      } as any;

      return Object.entries(flatCustomer);
    }

    return [];
  }
  insertLastYear(key: string): string {
    if (key === 'lastYearNetSales' || key === 'lastYearGPI') {
      return `${this.lastYear}`;
    }

    return '';
  }

  openCustomer(): void {
    this.router.navigate([AppRoutePath.CustomerViewPath], {
      queryParamsHandling: 'preserve',
    });
  }
}
