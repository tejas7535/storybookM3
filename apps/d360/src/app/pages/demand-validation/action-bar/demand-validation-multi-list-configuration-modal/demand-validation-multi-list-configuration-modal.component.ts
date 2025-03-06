import { Component, DestroyRef, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { finalize } from 'rxjs';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialType } from '../../../../feature/demand-validation/model';
import { DemandValidationMultiListEditModalComponent } from './demand-validation-multi-list-edit-modal/demand-validation-multi-list-edit-modal.component';

interface DemandValidationMultiListEditModalProps {
  customerName: string;
  customerNumber: string;
}

@Component({
  selector: 'd360-demand-validation-multi-list-edit-modal',
  imports: [
    MatDialogModule,
    SharedTranslocoModule,
    MatButton,
    ReactiveFormsModule,
    MatRadioButton,
    MatRadioGroup,
  ],
  templateUrl:
    './demand-validation-multi-list-configuration-modal.component.html',
})
export class DemandValidationMultiListConfigurationModalComponent {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef: MatDialogRef<DemandValidationMultiListConfigurationModalComponent> =
    inject(MatDialogRef<DemandValidationMultiListConfigurationModalComponent>);

  public customerName = input.required<string>();

  protected data: DemandValidationMultiListEditModalProps =
    inject(MAT_DIALOG_DATA);

  protected listEditConfigurationForm = new FormGroup({
    materialType: new FormControl<MaterialType>('schaeffler'),
  });

  protected continueToMultiEdit() {
    this.dialog
      .open(DemandValidationMultiListEditModalComponent, {
        data: {
          customerName: this.data.customerName,
          customerNumber: this.data.customerNumber,
          materialType:
            this.listEditConfigurationForm.controls.materialType.getRawValue(),
        },
        panelClass: ['form-dialog', 'demand-validation-multi-edit'],
        autoFocus: false,
        disableClose: true,
      })
      .afterOpened()
      .pipe(
        finalize(() => this.dialogRef.close()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
