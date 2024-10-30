import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

import { translate, TranslocoDirective } from '@jsverse/transloco';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import { IMRSubstitution } from '../../../../../feature/internal-material-replacement/model';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';

@Component({
  selector: 'app-internal-material-replacement-single-delete-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    TranslocoDirective,
  ],
  templateUrl:
    './internal-material-replacement-single-delete-modal.component.html',
  styleUrl:
    './internal-material-replacement-single-delete-modal.component.scss',
})
export class InternalMaterialReplacementSingleDeleteModalComponent {
  constructor(
    private readonly snackBarService: SnackbarService,
    private readonly imrService: IMRService,
    @Inject(MAT_DIALOG_DATA) public imrSubstitution: IMRSubstitution,
    public dialogRef: MatDialogRef<InternalMaterialReplacementSingleDeleteModalComponent>
  ) {}

  protected deleteEntry() {
    if (!this.imrSubstitution) {
      return;
    }
    this.imrService
      .deleteIMRSubstitution(this.imrSubstitution, false)
      .subscribe((response) => {
        const userMessage = singlePostResultToUserMessage(
          response,
          errorsFromSAPtoMessage,
          translate('generic.validation.save.success', {})
        );

        this.snackBarService.openSnackBar(userMessage.message);
        // TODO implement with variant
        // enqueueSnackbar(userMessage.message, { variant: userMessage.variant });
        if (userMessage.variant === 'success') {
          this.dialogRef.close(true);
        }
        this.dialogRef.close(false);
      });
  }
}
