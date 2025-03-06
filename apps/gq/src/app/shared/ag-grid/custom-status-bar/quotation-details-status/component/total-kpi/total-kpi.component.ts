import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.model';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-total-kpi',
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule],
  templateUrl: './total-kpi.component.html',
})
export class TotalKpiComponent {
  readonly quotationCurrency: InputSignal<string> = input.required<string>();
  readonly quotationKpi: InputSignal<QuotationDetailsSummaryKpi> =
    input.required<QuotationDetailsSummaryKpi>();
  readonly showGpm: InputSignal<boolean> = input.required<boolean>();
  readonly showGpi: InputSignal<boolean> = input.required<boolean>();
}
