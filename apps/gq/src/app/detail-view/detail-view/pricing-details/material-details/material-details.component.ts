import { Component, Input } from '@angular/core';

import { QuotationDetail } from '@gq/shared/models/quotation-detail';
import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';

@Component({
  selector: 'gq-material-details',
  templateUrl: './material-details.component.html',
  standalone: false,
})
export class MaterialDetailsComponent {
  @Input() quotationDetail: QuotationDetail;
  @Input() materialSalesOrg: MaterialSalesOrg;
  @Input() materialSalesOrgDataAvailable: boolean;
}
