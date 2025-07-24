import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { map, Observable } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { Rfq4ProcessModule } from '@gq/core/store/rfq-4-process/rfq-4-process.module';
import { CalculatorMissingComponent } from '@gq/process-case-view/tabs/open-items-tab/open-items-table/modals/calculator-missing/calculator-missing.component';
import { CellRendererModule } from '@gq/shared/ag-grid/cell-renderer/cell-renderer.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';
import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ApprovalProcessAction } from '../models/approval-process-action.enum';
import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';
import { ProcessHistoryComponent } from '../process-history/process-history.component';
import { StartProcessComponent } from '../start-process/start-process.component';

@Component({
  selector: 'gq-processes-modal-wrapper',
  templateUrl: './processes-modal-wrapper.component.html',
  imports: [
    CommonModule,
    DialogHeaderModule,
    StartProcessComponent,
    CalculatorMissingComponent,
    PushPipe,
    LoadingSpinnerModule,
    Rfq4ProcessModule,
    CellRendererModule,
    ProcessHistoryComponent,
  ],
})
export class ProcessesModalWrapperComponent implements OnInit {
  private readonly rfq4ProcessesFacade: Rfq4ProcessFacade =
    inject(Rfq4ProcessFacade);

  private readonly dialogRef: MatDialogRef<ProcessesModalWrapperComponent> =
    inject(MatDialogRef);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  processEnum: typeof ApprovalProcessAction = ApprovalProcessAction;
  modalData: ProcessesModalDialogData = inject(MAT_DIALOG_DATA);
  title = '';

  isProcessLoading$: Observable<boolean> =
    this.rfq4ProcessesFacade.isProcessLoading$;
  calculators$: Observable<string[]> = this.rfq4ProcessesFacade.calculators$;

  closeDialog(): void {
    this.rfq4ProcessesFacade.clearCalculators();
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.getTitle(this.modalData.quotationDetail);

    let closeAction: Observable<void>;
    switch (this.modalData.process) {
      case ApprovalProcessAction.START: {
        closeAction = this.rfq4ProcessesFacade.sendRecalculateSqvSuccess$;
        this.rfq4ProcessesFacade.findCalculators(
          this.modalData.quotationDetail.gqPositionId
        );
      }

      // no default
    }
    closeAction
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
  }

  private getTitle(quotationDetail: QuotationDetail): void {
    switch (this.modalData.process) {
      case ApprovalProcessAction.SHOW_HISTORY: {
        this.title = translate(
          'shared.openItemsTable.approvalProcesses.showHistory.title',
          {
            posId: quotationDetail.quotationItemId,
            rfq4Id: 'anyIdIDoNotHaveIt',
          }
        );
        break;
      }
      case ApprovalProcessAction.REOPEN: {
        // Placeholder for reopen
        break;
      }
      case ApprovalProcessAction.CANCEL: {
        // Placeholder for Cancel
        break;
      }
      case ApprovalProcessAction.START: {
        this.calculators$
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            map((calculators: string[]) => {
              this.title =
                calculators.length > 0
                  ? translate(
                      'shared.openItemsTable.approvalProcesses.start.title',
                      { posId: quotationDetail.quotationItemId }
                    )
                  : translate(
                      'shared.openItemsTable.approvalProcesses.calculatorMissing.title',
                      { posId: quotationDetail.quotationItemId }
                    );
            })
          )
          .subscribe();
      }
      // no default
    }
  }
}
