import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { Rfq4ProcessModule } from '@gq/core/store/rfq-4-process/rfq-4-process.module';
import { CancelProcessComponent } from '@gq/process-case-view/tabs/rfq-items-tab/rfq-items-table/modals/cancel-process/cancel-process.component';
import { CellRendererModule } from '@gq/shared/ag-grid/cell-renderer/cell-renderer.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { QuotationDetail } from '@gq/shared/models/quotation-detail/quotation-detail.model';
import { QuotationDetailRfq4 } from '@gq/shared/models/quotation-detail/rfq/quotation-detail-rfq4.interface';
import { translate } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';
import { RecalculationProcessAction } from '../models/recalculation-process-action.enum';
import { ProcessHistoryComponent } from '../process-history/process-history.component';
import { ReopenProcessComponent } from '../reopen-process/reopen-process.component';
import { StartProcessComponent } from '../start-process/start-process.component';

@Component({
  selector: 'gq-processes-modal-wrapper',
  templateUrl: './processes-modal-wrapper.component.html',
  imports: [
    CommonModule,
    DialogHeaderModule,
    StartProcessComponent,
    ReopenProcessComponent,
    CancelProcessComponent,
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

  processEnum: typeof RecalculationProcessAction = RecalculationProcessAction;
  modalData: ProcessesModalDialogData = inject(MAT_DIALOG_DATA);
  process: BehaviorSubject<RecalculationProcessAction> = new BehaviorSubject(
    null
  );
  title = '';

  isProcessLoading$: Observable<boolean> =
    this.rfq4ProcessesFacade.isProcessLoading$;
  calculators$: Observable<string[]> = this.rfq4ProcessesFacade.calculators$;
  quotationDetailRfq4$: Observable<QuotationDetailRfq4>;

  closeDialog(): void {
    this.rfq4ProcessesFacade.clearCalculators();
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.setProcess(this.modalData.process);
    this.quotationDetailRfq4$ = this.rfq4ProcessesFacade.getQuotationDetailRfq(
      this.modalData.quotationDetail.gqPositionId
    );

    this.initModal();
  }

  setProcess(process: RecalculationProcessAction): void {
    this.process.next(process);
  }

  initModal() {
    let closeAction: Observable<void>;

    this.process.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((p) => {
      this.getTitle(this.modalData.quotationDetail, p);

      switch (p) {
        case RecalculationProcessAction.START: {
          closeAction = this.rfq4ProcessesFacade.sendRecalculateSqvSuccess$;
          this.rfq4ProcessesFacade.findCalculators(
            this.modalData.quotationDetail.gqPositionId
          );
          break;
        }
        case RecalculationProcessAction.REOPEN: {
          const reopenAction =
            this.rfq4ProcessesFacade.sendReopenRecalculationSuccess$;
          // modal stays open after reopen and switches to start modal
          reopenAction
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
              this.process.next(RecalculationProcessAction.START);
            });
          break;
        }
        case RecalculationProcessAction.CANCEL: {
          closeAction = this.rfq4ProcessesFacade.cancelProcessSuccess$;
          break;
        }
        case RecalculationProcessAction.SHOW_HISTORY: {
          this.rfq4ProcessesFacade.getProcessHistory(
            this.modalData.quotationDetail.gqPositionId
          );
          break;
        }
        // no default
      }
      closeAction
        ?.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.closeDialog());
    });
  }

  private getTitle(
    quotationDetail: QuotationDetail,
    process: RecalculationProcessAction
  ): void {
    switch (process) {
      case RecalculationProcessAction.SHOW_HISTORY: {
        this.title = translate(
          'shared.rfqItemsTable.approvalProcesses.showHistory.title',
          {
            posId: quotationDetail.quotationItemId,
            rfq4Id: quotationDetail.rfq4.rfq4Id,
          }
        );
        break;
      }
      case RecalculationProcessAction.REOPEN: {
        this.title = translate(
          'shared.rfqItemsTable.approvalProcesses.reopen.title',
          {
            posId: quotationDetail.quotationItemId,
            rfq4Id: quotationDetail.rfq4.rfq4Id,
          }
        );
        break;
      }
      case RecalculationProcessAction.CANCEL: {
        this.title = translate(
          'shared.rfqItemsTable.approvalProcesses.cancel.title',
          {
            posId: quotationDetail.quotationItemId,
            rfq4Id: quotationDetail.rfq4.rfq4Id,
          }
        );
        break;
      }
      case RecalculationProcessAction.START: {
        this.calculators$
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            map((calculators: string[]) => {
              this.title =
                calculators.length > 0
                  ? translate(
                      'shared.rfqItemsTable.approvalProcesses.start.title',
                      { posId: quotationDetail.quotationItemId }
                    )
                  : translate(
                      'shared.rfqItemsTable.approvalProcesses.calculatorMissing.title',
                      { posId: quotationDetail.quotationItemId }
                    );
            })
          )
          .subscribe();
        break;
      }
      // no default
    }
  }
}
