import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { AppRoutePath } from '../../../../app-route-path.enum';
import { ViewQuotation } from '../../../../case-view/models/view-quotation.model';

@Component({
  selector: 'gq-gq-id',
  templateUrl: './gq-id.component.html',
  styles: [],
})
export class GqIdComponent {
  quotation: ViewQuotation;
  valueFormatted: string;
  urlQueryParams: NavigationExtras;
  url: string;

  constructor(private readonly router: Router) {}

  agInit(params: any): void {
    this.valueFormatted = params.valueFormatted;
    this.quotation = params.data;
    const { customerId, salesOrg } = this.quotation.customerIdentifiers;
    this.urlQueryParams = {
      queryParamsHandling: 'merge',
      queryParams: {
        quotation_number: this.quotation.gqId,
        customer_number: customerId,
        sales_org: salesOrg,
      },
    };

    this.url = this.router
      .createUrlTree([AppRoutePath.ProcessCaseViewPath], this.urlQueryParams)
      .toString();
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();

    this.router.navigate(
      [AppRoutePath.ProcessCaseViewPath],
      this.urlQueryParams
    );
  }
}
