import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { Rfq4ProcessModule } from '@gq/core/store/rfq-4-process/rfq-4-process.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost/rfq-4-status.enum';
import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';
import { translate } from '@jsverse/transloco';
import { LetDirective, PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ApprovalProcessAction } from '../models/approval-process-action.enum';
import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';
import { StartProcessComponent } from '../start-process/start-process.component';

@Component({
  selector: 'gq-processes-modal-wrapper',
  templateUrl: './processes-modal-wrapper.component.html',
  imports: [
    CommonModule,
    DialogHeaderModule,
    StartProcessComponent,
    PushPipe,
    LetDirective,
    LoadingSpinnerModule,
    Rfq4ProcessModule,
  ],
})
export class ProcessesModalWrapperComponent implements OnInit {
  private readonly rfq4ProcessesFacade: Rfq4ProcessFacade =
    inject(Rfq4ProcessFacade);
  private readonly dialogRef: MatDialogRef<ProcessesModalWrapperComponent> =
    inject(MatDialogRef);

  processEnum: typeof ApprovalProcessAction = ApprovalProcessAction;
  modalData: ProcessesModalDialogData = inject(MAT_DIALOG_DATA);
  title: string = this.getTitle(this.modalData.quotationDetail);

  findCalculatorsLoading$: Observable<boolean> =
    this.rfq4ProcessesFacade.findCalculatorsLoading$;
  calculators$: Observable<string[]> = this.rfq4ProcessesFacade.calculators$;
  sendRecalculationRequestLoading$: Observable<boolean> =
    this.rfq4ProcessesFacade.sendRecalculateSqvLoading$;

  closeDialog(): void {
    this.rfq4ProcessesFacade.clearCalculators();
    this.dialogRef.close();
  }

  ngOnInit(): void {
    switch (this.modalData.process) {
      case ApprovalProcessAction.START: {
        this.rfq4ProcessesFacade.findCalculators(
          this.modalData.quotationDetail.gqPositionId
        );
      }

      // no default
    }
  }

  private getTitle(quotationDetail: QuotationDetail): string {
    switch (quotationDetail.detailCosts?.rfq4Status) {
      case Rfq4Status.OPEN: {
        return translate(
          'shared.openItemsTable.approvalProcesses.start.title',
          { posId: quotationDetail.quotationItemId }
        );
      }
      // no default
    }

    return '';
  }
}
