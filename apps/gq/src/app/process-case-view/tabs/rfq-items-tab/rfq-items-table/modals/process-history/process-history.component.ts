import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  InputSignal,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import {
  buttonHoverActiveStyle,
  rippleButtonOverrides,
} from '@gq/shared/constants/custom-button-styles';
import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { Rfq4Status } from '@gq/shared/models/quotation-detail/cost';
import { SqvApprovalStatus } from '@gq/shared/models/quotation-detail/cost/sqv-approval-status.enum';
import { MicrosoftGraphMapperService } from '@gq/shared/services/rest/microsoft-graph-mapper/microsoft-graph-mapper.service';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
export class ProcessHistoryComponent implements OnInit {
  private readonly rfq4ProcessesFacade: Rfq4ProcessFacade =
    inject(Rfq4ProcessFacade);
  private readonly msGraphMapperService = inject(MicrosoftGraphMapperService);
  private readonly destroyRef = inject(DestroyRef);
  quotationDetail: InputSignal<QuotationDetail> = input<QuotationDetail>(null);
  cancelButtonClicked = output();
  changeModal = output<RecalculationProcessAction>();
  processHistoryData = toSignal(this.rfq4ProcessesFacade.processHistory$);
  hasAssignee = computed(() => {
    const history = this.processHistoryData();

    return history ? history.assignedUserId != null : false;
  });
  rfq4Status = computed(() => {
    const history = this.processHistoryData();

    return history ? history.rfq4Status : Rfq4Status.IN_PROGRESS;
  });
  assignee = signal<ActiveDirectoryUser | null>(null);

  ngOnInit(): void {
    if (this.hasAssignee()) {
      this.msGraphMapperService
        .getActiveDirectoryUserByUserId(
          this.processHistoryData().assignedUserId
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((user) => {
          this.assignee.set(user);
        });
    }
  }

  activeStep = computed(() => {
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
