import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppRoutePath } from '../../../app-route-path.enum';
import { ViewQuotation } from '../../../case-view/models/view-quotation.model';

@Component({
  selector: 'gq-gq-id',
  templateUrl: './gq-id.component.html',
  styles: [],
})
export class GqIdComponent {
  quotation: ViewQuotation;
  valueFormatted: string;

  constructor(private readonly router: Router) {}

  agInit(params: any): void {
    this.valueFormatted = params.valueFormatted;
    this.quotation = params.data;
  }

  navigate(event: MouseEvent): void {
    event.preventDefault();
    const { customerId, salesOrg } = this.quotation.customerIdentifiers;
    this.router.navigate([AppRoutePath.ProcessCaseViewPath], {
      queryParamsHandling: 'merge',
      queryParams: {
        quotation_number: this.quotation.gqId,
        customer_number: customerId,
        sales_org: salesOrg,
      },
    });
  }
}
