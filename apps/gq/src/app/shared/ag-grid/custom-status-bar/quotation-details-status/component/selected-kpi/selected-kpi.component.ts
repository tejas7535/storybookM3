import { CommonModule } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';

import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-selected-kpi',
  standalone: true,
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule, PushPipe],
  templateUrl: './selected-kpi.component.html',
})
export class SelectedKpiComponent {
  readonly quotationCurrency: InputSignal<string> = input.required<string>();
  readonly selectedQuotationDetailsKpi: InputSignal<QuotationDetailsSummaryKpi> =
    input.required<QuotationDetailsSummaryKpi>();
  readonly showGpm: InputSignal<boolean> = input.required<boolean>();
  readonly showGpi: InputSignal<boolean> = input.required<boolean>();
}
