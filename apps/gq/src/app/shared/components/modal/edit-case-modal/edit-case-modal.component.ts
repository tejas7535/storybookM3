/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EditCaseHeaderInformationComponent } from '../../case-header-information/edit-case-header-information/edit-case-header-information.component';
import { DialogHeaderModule } from '../../header/dialog-header/dialog-header.module';

@Component({
  selector: 'gq-edit-case-modal',
  templateUrl: './edit-case-modal.component.html',
  styleUrls: ['./edit-case-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SharedTranslocoModule,
    MatDialogModule,
    EditCaseHeaderInformationComponent,
    DialogHeaderModule,
  ],
})
export class EditCaseModalComponent {
  dialogRef: MatDialogRef<EditCaseModalComponent> = inject(
    MatDialogRef<EditCaseModalComponent>
  );

  closeDialog(): void {
    this.dialogRef.close();
  }
}
