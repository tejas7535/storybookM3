import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { CreateManualCaseComponent } from '../../../../../case-view/case-creation/create-manual-case/create-manual-case.component';

@Component({
  selector: 'gq-cancel-case-button',
  templateUrl: './cancel-case-button.component.html',
})
export class CancelCaseButtonComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<CreateManualCaseComponent>
  ) {}

  agInit(): void {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
