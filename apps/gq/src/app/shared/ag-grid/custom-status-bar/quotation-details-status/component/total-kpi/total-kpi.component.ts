import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-total-kpi',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule, PushPipe],
  templateUrl: './total-kpi.component.html',
})
export class TotalKpiComponent {
  readonly quotationCurrency: InputSignal<string> = input.required<string>();
  readonly quotationKpi: InputSignal<QuotationDetailsSummaryKpi> =
    input.required<QuotationDetailsSummaryKpi>();
  readonly showGpm: InputSignal<boolean> = input.required<boolean>();
  readonly showGpi: InputSignal<boolean> = input.required<boolean>();
}
