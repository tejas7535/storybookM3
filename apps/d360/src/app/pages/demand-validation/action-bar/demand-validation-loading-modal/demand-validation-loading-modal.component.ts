import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

import { catchError, EMPTY, Observable, tap } from 'rxjs';

import { TranslocoDirective } from '@jsverse/transloco';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';

import { getErrorMessage } from '../../../../shared/utils/errors';
import { SnackbarService } from '../../../../shared/utils/service/snackbar.service';

export interface DemandValidationLoadingModalProps {
  textWhileLoading?: string;
  onInit: () => Observable<any>;
  onClose?: () => void;
}

@Component({
  selector: 'd360-demand-validation-loading-modal',
  imports: [LoadingSpinnerModule, TranslocoDirective, MatDialogContent],
  templateUrl: './demand-validation-loading-modal.component.html',
})
export class DemandValidationLoadingModalComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbarService = inject(SnackbarService);
  private readonly dialogRef = inject(
    MatDialogRef<DemandValidationLoadingModalComponent>
  );

  protected readonly data: DemandValidationLoadingModalProps =
    inject(MAT_DIALOG_DATA);

  public ngOnInit() {
    this.data
      .onInit()
      .pipe(
        tap(() => {
          this.data.onClose?.();
          this.dialogRef.close();
        }),
        catchError((e) => {
          this.snackbarService.openSnackBar(getErrorMessage(e));

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
