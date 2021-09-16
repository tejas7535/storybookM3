import { Component, Input, OnInit } from '@angular/core';

import { Customer } from '../../shared/models/customer';
import { HelperService } from '../../shared/services/helper-service/helper-service.service';

@Component({
  selector: 'gq-customer-information',
  templateUrl: './customer-information.component.html',
})
export class CustomerInformationComponent implements OnInit {
  public currentYear: number;
  public lastYear: number;

  @Input() customer: Customer;

  ngOnInit(): void {
    this.currentYear = HelperService.getCurrentYear();
    this.lastYear = HelperService.getLastYear();
  }
}
