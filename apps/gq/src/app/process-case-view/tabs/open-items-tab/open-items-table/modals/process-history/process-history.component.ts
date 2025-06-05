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

import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';
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
})
export class ProcessHistoryComponent {
  modalData: InputSignal<ProcessesModalDialogData> =
    input<ProcessesModalDialogData>(null);
  cancelButtonClicked = output();
  // TODO: implement logic to determine if the process has an assignee
  hasAssignee = signal<boolean>(false);
  rfq4Status = signal<Rfq4Status>(Rfq4Status.IN_PROGRESS);

  activeStep = computed(() => {
    // TODO: remove when testing is finished
    switch (this.rfq4Status()) {
      //   switch (this.modalData().quotationDetail.detailCosts.rfq4Status) {
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

  rfq4StatusEnum = Rfq4Status;
  closeDialog(): void {}
}
