import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';

import { tap } from 'rxjs';

import { InfoBannerComponent } from '@schaeffler/feedback-banner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PlanningLevelMaterial } from '../../../../feature/sales-planning/model';
import { CustomerPlanningLevelConfirmationModalComponent } from '../customer-planning-level-confirmation-modal/customer-planning-level-confirmation-modal.component';

export interface CustomerPlanningLevelConfigurationModalProps {
  customerName: string;
  customerNumber: string;
  planningLevelMaterial: PlanningLevelMaterial;
}

@Component({
  selector: 'd360-customer-planning-level-configuration-modal',
  imports: [
    CommonModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    SharedTranslocoModule,
    InfoBannerComponent,
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
  ],
  templateUrl: './customer-planning-level-configuration-modal.component.html',
})
export class CustomerPlanningLevelConfigurationModalComponent {
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly dialogRef: MatDialogRef<CustomerPlanningLevelConfigurationModalComponent> =
    inject(MatDialogRef<CustomerPlanningLevelConfigurationModalComponent>);

  protected readonly data: CustomerPlanningLevelConfigurationModalProps =
    inject(MAT_DIALOG_DATA);
  public readonly control = new FormControl();

  protected readonly planningLevelMaterialTypes = ['GP', 'PL'];
  // Hint: PC was implemented with D360-138 and was removed with D360-322, because it is not fully implemented by the backend yet.
  // protected readonly planningLevelMaterialTypes = ['GP', 'PL', 'PC'];

  public onSave() {
    if (this.planningLevelMaterialTypeWasNotChanged()) {
      this.dialogRef.close({
        deleteExistingPlanningData: false,
      });
    }

    if (this.planningLevelMaterialTypeCanBeOverriddenWithoutDataDeletion()) {
      this.dialogRef.close({
        deleteExistingPlanningData: false,
        newPlanningLevelMaterialType: this.control.value,
      });
    } else {
      this.confirmDataDeletion();
    }
  }

  private confirmDataDeletion() {
    this.dialog
      .open(CustomerPlanningLevelConfirmationModalComponent, {
        data: {
          customerName: this.data.customerName,
          customerNumber: this.data.customerNumber,
        },
        width: '600px',
        maxWidth: '900px',
        autoFocus: false,
        disableClose: true,
      })
      .afterClosed()
      .pipe(
        tap(
          (overrideConfirmed: boolean) =>
            overrideConfirmed &&
            this.dialogRef.close({
              deleteExistingPlanningData: true,
              newPlanningLevelMaterialType: this.control.value,
            })
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private planningLevelMaterialTypeCanBeOverriddenWithoutDataDeletion() {
    return this.data.planningLevelMaterial.isDefaultPlanningLevelMaterialType;
  }

  private planningLevelMaterialTypeWasNotChanged() {
    return (
      this.control.value ===
      this.data.planningLevelMaterial.planningLevelMaterialType
    );
  }

  public onCancel() {
    this.dialogRef.close({ deleteExistingPlanningData: false });
  }
}
