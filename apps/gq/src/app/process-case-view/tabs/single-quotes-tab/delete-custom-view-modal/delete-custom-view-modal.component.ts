import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'gq-delete-custom-view-modal',
  templateUrl: './delete-custom-view-modal.component.html',
  imports: [MatButtonModule, DialogHeaderModule, SharedTranslocoModule],
})
export class DeleteCustomViewModalComponent {
  private readonly dialogRef = inject(
    MatDialogRef<DeleteCustomViewModalComponent>
  );

  closeDialog(): void {
    this.dialogRef.close({ delete: false });
  }

  confirm(): void {
    this.dialogRef.close({ delete: true });
  }
}
