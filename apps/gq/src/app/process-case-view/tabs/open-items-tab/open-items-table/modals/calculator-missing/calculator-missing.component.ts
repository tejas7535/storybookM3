import { CommonModule } from '@angular/common';
import { Component, inject, input, InputSignal, output } from '@angular/core';

import { getSeperatedNamesOfMaintainers } from '@gq/core/store/rfq-4-process/consts/maintainer-mail.consts';
import { Rfq4ProcessFacade } from '@gq/core/store/rfq-4-process/rfq-4-process.facade';
import { ActiveDirectoryUser, QuotationDetail } from '@gq/shared/models';
import { LetDirective } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ModalFooterComponent } from '../modal-footer/modal-footer.component';

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
  quotationDetail: InputSignal<QuotationDetail> = input<QuotationDetail>(null);
  cancelButtonClicked = output();

  readonly maintainers$ = this.rfq4ProcessesFacade.maintainers$;

  closeDialog(): void {
    this.cancelButtonClicked.emit();
  }

  getMaintainer(user: ActiveDirectoryUser): string {
    return `${user?.firstName} ${user?.lastName} (${user?.userId?.toUpperCase()})`;
  }
  getMaintainers(
    maintainers: ActiveDirectoryUser[],
    lastItemSeperator: string
  ): string {
    const maintainersFormatted = maintainers.map((user) =>
      this.getMaintainer(user)
    );

    return getSeperatedNamesOfMaintainers(
      maintainersFormatted,
      lastItemSeperator
    );
  }

  sendEmail(): void {
    this.rfq4ProcessesFacade.sendEmailRequestToMaintainCalculators(
      this.quotationDetail()
    );

    this.closeDialog();
  }
}
