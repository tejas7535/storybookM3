import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppRoutePath } from '../../../app-route-path.enum';

@Component({
  selector: 'gq-finish-offer',
  templateUrl: './finish-offer-button.component.html',
})
export class FinishOfferButtonComponent {
  public quotationNumber: string;
  public customerNumber: string;
  public salesOrg: string;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.quotationNumber = params['quotation_number'];
      this.customerNumber = params['customer_number'];
      this.salesOrg = params['sales_org'];
    });
  }

  agInit(): void {}

  finishOffer(): void {
    this.router.navigate([AppRoutePath.OfferViewPath], {
      queryParams: {
        quotation_number: this.quotationNumber,
        customer_number: this.customerNumber,
        sales_org: this.salesOrg,
      },
    });
  }
}
