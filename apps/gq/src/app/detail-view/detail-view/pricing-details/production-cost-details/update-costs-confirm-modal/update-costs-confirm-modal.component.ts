import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';

@Component({
  selector: 'gq-update-costs-confirm-modal',
  templateUrl: './update-costs-confirm-modal.component.html',
})
export class UpdateCostsConfirmModalComponent {
  constructor(
    public readonly activeCaseFacade: ActiveCaseFacade,
    @Inject(MAT_DIALOG_DATA)
    public readonly modalData: { gqPosId: string },
    private readonly dialogRef: MatDialogRef<UpdateCostsConfirmModalComponent>
  ) {}

  confirm(): void {
    this.activeCaseFacade.updateCosts(this.modalData.gqPosId);
    this.activeCaseFacade.updateCostsSuccess$
      .pipe(take(1))
      .subscribe(() => this.closeDialog());
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
