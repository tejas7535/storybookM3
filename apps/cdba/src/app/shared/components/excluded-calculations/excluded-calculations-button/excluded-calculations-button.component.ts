import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ExcludedCalculations } from '@cdba/shared/models/index';

import { ExcludedCalculationsDialogComponent } from '../excluded-calculations-dialog/excluded-calculations-dialog.component';

@Component({
  selector: 'cdba-excluded-calculations-button',
  templateUrl: './excluded-calculations-button.component.html',
})
export class ExcludedCalculationsButtonComponent {
  @Input() excludedCalculations: ExcludedCalculations = undefined;

  public constructor(private readonly dialog: MatDialog) {}

  public onButtonClick(event: { target: any }): void {
    const target = event.target;

    if (target) {
      target.blur();
    }

    this.dialog.open(ExcludedCalculationsDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
      maxWidth: 500,
      autoFocus: false,
      data: this.excludedCalculations,
    });
  }
}
