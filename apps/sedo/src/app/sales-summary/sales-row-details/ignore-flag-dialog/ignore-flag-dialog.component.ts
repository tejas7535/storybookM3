import { Component, Inject } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { IGNORE_FLAG_DESCRIPTIONS } from '../../sales-table/constants/ignore-flag-descriptions.const';
import { IgnoreFlag } from '../enums/ignore-flag.enum';

interface IgnoreReason {
  ignoreFlag: IgnoreFlag;
  reason: string;
}

@Component({
  selector: 'sedo-ignore-flag-dialog',
  templateUrl: './ignore-flag-dialog.component.html',
})
export class IgnoreFlagDialogComponent {
  public ignoreReasons: IgnoreReason[] = [
    {
      ignoreFlag: IgnoreFlag.None,
      reason: IGNORE_FLAG_DESCRIPTIONS[IgnoreFlag.None],
    },
    {
      ignoreFlag: IgnoreFlag.CustomerNumberChange,
      reason: IGNORE_FLAG_DESCRIPTIONS[IgnoreFlag.CustomerNumberChange],
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public currentIgnoreFlag: IgnoreFlag,
    private readonly dialogRef: MatDialogRef<IgnoreFlagDialogComponent>
  ) {}

  public cancel(): void {
    this.dialogRef.close();
  }
}
