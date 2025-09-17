import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialogContent } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RolesFacade } from '@gq/core/store/facades';
import { RfqProcessHistory } from '@gq/core/store/rfq-4-process/model/process-history.model';
import { InfoBannerComponent } from '@gq/shared/components/info-banner/info-banner.component';
import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProcessHistoryAttachmentsComponent } from './process-history-attachments/process-history-attachments.component';
import { RecalculationDataItemComponent } from './recalculation-data-item/recalculation-data-item.component';

@Component({
  selector: 'gq-recalculation-data',
  templateUrl: './recalculation-data.component.html',
  imports: [
    CommonModule,
    SharedTranslocoModule,
    RecalculationDataItemComponent,
    ProcessHistoryAttachmentsComponent,
    SharedPipesModule,
    LetDirective,
    InfoBannerComponent,
    MatDialogContent,
  ],
})
export class RecalculationDataComponent {
  quotationDetail: InputSignal<QuotationDetail> = input(null);
  hasAssignee: InputSignal<boolean> = input(true);
  assignee: InputSignal<ActiveDirectoryUser | null> = input(null);
  // Can properly be removed when the implementation process is finished
  rfq4Status: InputSignal<Rfq4Status | null> = input(null);
  processHistoryData: InputSignal<RfqProcessHistory | null> = input(null);

  private readonly activeCaseFacade: ActiveCaseFacade =
    inject(ActiveCaseFacade);
  private readonly rolesFacade = inject(RolesFacade);
  hasSqvRole = toSignal(this.rolesFacade.userHasSQVRole$);
  quotationCurrency$: Observable<string> =
    this.activeCaseFacade.quotationCurrency$;

  readonly rfq4StatusEnum = Rfq4Status;
}
