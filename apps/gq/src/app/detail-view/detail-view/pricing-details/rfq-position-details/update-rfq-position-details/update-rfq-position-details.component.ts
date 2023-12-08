import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { RfqModalData } from '@gq/detail-view/detail-view/pricing-details/rfq-position-details/models/rfq-modal-data.model';

@Component({
  selector: 'gq-update-rfq-position-details',
  templateUrl: './update-rfq-position-details.component.html',
})
export class UpdateRfqPositionDetailsComponent {
  private readonly activeCaseFacade = inject(ActiveCaseFacade);
  private readonly modalData = inject(MAT_DIALOG_DATA) as RfqModalData;
  private readonly dialogRef = inject(
    MatDialogRef<UpdateRfqPositionDetailsComponent>
  );
  private readonly destroyRef = inject(DestroyRef);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  readonly rfqInformationUpdating$ =
    this.activeCaseFacade.rfqInformationUpdating$;

  confirm(): void {
    this.activeCaseFacade.updateRfqInformation(this.modalData.gqPositionId);
    this.activeCaseFacade.updateRfqInformationSuccess$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.closeDialog());
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
