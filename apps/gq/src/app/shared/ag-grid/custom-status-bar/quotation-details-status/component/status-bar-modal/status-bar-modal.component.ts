import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { activeCaseFeature } from '@gq/core/store/active-case/active-case.reducer';
import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import { userHasGPCRole, userHasSQVRole } from '@gq/core/store/selectors';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { QuotationDetailsSummaryKpi } from '@gq/shared/models/quotation/quotation-details-summary-kpi.interface';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { selectedQuotationDetailsKpiFeature } from '../../store/selected-quotation-details-kpi.reducer';

@Component({
  selector: 'gq-status-bar-modal',
  templateUrl: './status-bar-modal.component.html',
  standalone: true,
  imports: [
    LetDirective,
    CommonModule,
    DialogHeaderModule,
    SharedTranslocoModule,
    HorizontalDividerModule,
    LabelTextModule,
    PushPipe,
    SharedPipesModule,
  ],
})
export class StatusBarModalComponent {
  private readonly dialogRef: MatDialogRef<StatusBarModalComponent> = inject(
    MatDialogRef<StatusBarModalComponent>
  );
  private readonly store: Store = inject(Store);
  public readonly dialogData: { filteredAmount: number } =
    inject(MAT_DIALOG_DATA);

  showGPI$: Observable<boolean> = this.store.pipe(userHasGPCRole);
  showGPM$: Observable<boolean> = this.store.pipe(userHasSQVRole);
  quotationCurrency$: Observable<string> =
    this.store.select(getQuotationCurrency);
  quotationDetailsSummaryKpi$: Observable<QuotationDetailsSummaryKpi> =
    this.store.select(activeCaseFeature.getQuotationDetailsSummaryKpi);
  selectedQuotationDetailsSummaryKpi$: Observable<QuotationDetailsSummaryKpi> =
    this.store.select(
      selectedQuotationDetailsKpiFeature.selectSelectedQuotationDetailsKpi
    );

  closeDialog(): void {
    this.dialogRef.close();
  }
}
