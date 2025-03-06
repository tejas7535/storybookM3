import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MaterialSalesOrg } from '@gq/shared/models/quotation-detail/material-sales-org.model';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LabelTextModule } from '../../label-text/label-text.module';

@Component({
  selector: 'gq-material-sales-org-details',
  imports: [
    CommonModule,
    SharedPipesModule,
    SharedTranslocoModule,
    LabelTextModule,
  ],
  templateUrl: './material-sales-org-details.component.html',
})
export class MaterialSalesOrgDetailsComponent {
  @Input() materialSalesOrg: MaterialSalesOrg;
  @Input() materialSalesOrgDataAvailable: boolean;
}
