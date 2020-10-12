import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ProcessCaseHeaderModule } from './process-case-header/process-case-header.module';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { QuotationDetailsTableModule } from './quotation-details-table/quotation-details-table.module';

@NgModule({
  declarations: [ProcessCaseViewComponent],
  imports: [
    SharedModule,
    ProcessCaseViewRoutingModule,
    QuotationDetailsTableModule,
    ProcessCaseHeaderModule,
  ],
})
export class ProcessCaseViewModule {}
