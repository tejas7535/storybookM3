import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, output } from '@angular/core';

import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { ActiveDirectoryUser } from '@gq/shared/models';
import { LetDirective } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ModalFooterComponent } from '../modal-footer/modal-footer.component';
import { ProcessesModalDialogData } from '../models/processes-modal-dialog-data.interface';

@Component({
  selector: 'gq-calculator-missing',
  templateUrl: './calculator-missing.component.html',
  imports: [
    CommonModule,
    ModalFooterComponent,
    LoadingSpinnerModule,
    SharedTranslocoModule,
    LetDirective,
  ],
})
export class CalculatorMissingComponent {
  private readonly rfq4ProcessesFacade = inject(Rfq4ProcessFacade);
  modalData: InputSignal<ProcessesModalDialogData> =
    input<ProcessesModalDialogData>(null);
  cancelProcess = output();

  readonly maintainers$ = this.rfq4ProcessesFacade.maintainers$;

  closeDialog(): void {
    this.cancelProcess.emit();
  }

  getMaintainer(user: ActiveDirectoryUser): string {
    return `${user?.firstName} ${user?.lastName} (${user?.userId?.toUpperCase()})`;
  }

  sendEmail(): void {
    this.rfq4ProcessesFacade.sendEmailRequestToMaintainCalculators(
      this.modalData().quotationDetail
    );

    this.closeDialog();
  }
}
