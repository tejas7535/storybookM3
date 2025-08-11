import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { take } from 'rxjs';

import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';

@Component({
  selector: 'gq-update-costs-confirm-modal',
  templateUrl: './update-costs-confirm-modal.component.html',
  standalone: false,
})
export class UpdateCostsConfirmModalComponent {
  private readonly dialogRef: MatDialogRef<UpdateCostsConfirmModalComponent> =
    inject(MatDialogRef);
  public readonly activeCaseFacade: ActiveCaseFacade = inject(ActiveCaseFacade);
  public readonly modalData: { gqPosId: string } = inject(MAT_DIALOG_DATA);

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
