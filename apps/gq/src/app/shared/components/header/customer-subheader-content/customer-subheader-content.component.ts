import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { CalculatorCustomerData } from '@gq/calculator/rfq-4-detail-view/models/rfq-4-detail-view-data.interface';
import { Customer } from '@gq/shared/models';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-customer-subheader-content',
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule],
  templateUrl: './customer-subheader-content.component.html',
})
export class CustomerSubheaderContentComponent {
  displaySalesOrg = input<boolean>();
  customer = input.required<Customer | CalculatorCustomerData>();
}
