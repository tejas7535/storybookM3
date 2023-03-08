import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'gq-release-modal',
  templateUrl: './release-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseModalComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<ReleaseModalComponent>
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
