import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Inject, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

import { map, tap } from 'rxjs';

import { translate, TranslocoDirective } from '@jsverse/transloco';

import { IMRService } from '../../../../../feature/internal-material-replacement/imr.service';
import { IMRSubstitution } from '../../../../../feature/internal-material-replacement/model';
import {
  errorsFromSAPtoMessage,
  singlePostResultToUserMessage,
} from '../../../../../shared/utils/error-handling';
import { SnackbarService } from '../../../../../shared/utils/service/snackbar.service';

@Component({
  selector: 'd360-internal-material-replacement-single-delete-modal',
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
})
export class InternalMaterialReplacementSingleDeleteModalComponent {
  private readonly snackbarService = inject(SnackbarService);
  private readonly imrService = inject(IMRService);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    @Inject(MAT_DIALOG_DATA) public imrSubstitution: IMRSubstitution,
    public dialogRef: MatDialogRef<InternalMaterialReplacementSingleDeleteModalComponent>
  ) {}

  protected deleteEntry() {
    if (!this.imrSubstitution) {
      return;
    }
    this.imrService
      .deleteIMRSubstitution(this.imrSubstitution, false)
      .pipe(
        map((response) =>
          singlePostResultToUserMessage(
            response,
            errorsFromSAPtoMessage,
            translate('generic.validation.save.success')
          )
        ),
        tap((userMessage) => {
          this.snackbarService.openSnackBar(userMessage.message);
          if (userMessage.variant === 'success') {
            this.handleOnClose(true);
          } else {
            this.handleOnClose(false);
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  /**
   * Close the open dialogs
   *
   * @protected
   * @param {boolean} reloadData
   * @memberof InternalMaterialReplacementSingleDeleteModalComponent
   */
  protected handleOnClose(reloadData: boolean): void {
    this.dialogRef.close(reloadData);
  }
}
