import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  InputSignal,
  output,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  buttonHoverActiveStyle,
  rippleButtonOverrides,
} from '@gq/shared/constants/custom-button-styles';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';
import { RecalculationProcessAction } from '../models/recalculation-process-action.enum';
import { RecalculationDataComponent } from './recalculation-data/recalculation-data.component';
import { RecalculationProgressComponent } from './recalculation-progress/recalculation-progress.component';

@Component({
  selector: 'gq-process-history',
  templateUrl: './process-history.component.html',
  imports: [
    CommonModule,
    RecalculationProgressComponent,
    RecalculationDataComponent,
    MatButtonModule,
    SharedTranslocoModule,
  ],
  styles: [rippleButtonOverrides, buttonHoverActiveStyle],
})
export class ProcessHistoryComponent {
  modalData: InputSignal<ProcessesModalDialogData> =
    input<ProcessesModalDialogData>(null);
  cancelButtonClicked = output();
  // TODO: implement logic to determine if the process has an assignee
  hasAssignee = signal<boolean>(false);
  rfq4Status = signal<Rfq4Status>(Rfq4Status.IN_PROGRESS);
  changeModal = output<RecalculationProcessAction>();

  activeStep = computed(() => {
    // TODO: remove when testing is finished
    switch (this.rfq4Status()) {
      case Rfq4Status.IN_PROGRESS: {
        return this.hasAssignee() ? 2 : 1;
      }
      case Rfq4Status.CONFIRMED: {
        return 3;
      }
      case Rfq4Status.CANCELLED: {
        return this.hasAssignee() ? 2 : 1;
      }
      // no default
    }

    return 1;
  });

  canCancel = computed(
    (): boolean =>
      this.rfq4Status() === Rfq4Status.IN_PROGRESS ||
      this.rfq4Status() === Rfq4Status.OPEN ||
      this.rfq4Status() === Rfq4Status.REOPEN
  );
  rfq4StatusEnum = Rfq4Status;
  sqvApprovalStatusEnum = SqvApprovalStatus;
  recalculationProcessActionEnum = RecalculationProcessAction;

  triggerChangeProcess(process: RecalculationProcessAction): void {
    this.changeModal.emit(process);
  }
}
