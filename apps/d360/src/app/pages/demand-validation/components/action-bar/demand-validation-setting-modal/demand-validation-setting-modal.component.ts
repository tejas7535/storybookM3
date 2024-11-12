import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
} from '@angular/material/radio';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PlanningView } from '../../../../../feature/demand-validation/planning-view';

@Component({
  selector: 'd360-demand-validation-setting-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    SharedTranslocoModule,
    MatRadioGroup,
    MatRadioButton,
  ],
  templateUrl: './demand-validation-setting-modal.component.html',
  styleUrl: './demand-validation-setting-modal.component.scss',
})
export class DemandValidationSettingModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PlanningView,
    public dialogRef: MatDialogRef<DemandValidationSettingModalComponent>
  ) {}

  handleSave() {
    this.dialogRef.close(this.data);
  }

  protected readonly PlanningView = PlanningView;

  handleSettingsChange(event: MatRadioChange) {
    this.data = event.value;
  }
}
