import { Component, Input, OnInit } from '@angular/core';

import { Customer } from '../../core/store/models';
import { HelperService } from '../../shared/services/helperService/helper-service.service';

@Component({
  selector: 'gq-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss'],
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
