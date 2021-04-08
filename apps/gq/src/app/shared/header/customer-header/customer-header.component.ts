import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../../app-route-path.enum';
import { Customer } from '../../../core/store/models';
import { HelperService } from '../../services/helper-service/helper-service.service';

@Component({
  selector: 'gq-customer-header',
  templateUrl: './customer-header.component.html',
  styleUrls: ['./customer-header.component.scss'],
})
export class CustomerHeaderComponent implements OnInit {
  @Input() customer: Customer;
  public lastYear: number;
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.lastYear = HelperService.getLastYear();
  }

  openCustomer(): void {
    this.router.navigate([AppRoutePath.CustomerViewPath], {
      queryParamsHandling: 'preserve',
    });
  }
}
