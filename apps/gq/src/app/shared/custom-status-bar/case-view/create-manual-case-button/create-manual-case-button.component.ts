import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateManualCaseComponent } from 'apps/gq/src/app/case-view/case-creation/create-manual-case/create-manual-case.component';

@Component({
  selector: 'gq-create-manual-case',
  templateUrl: './create-manual-case-button.component.html',
})
export class CreateManualCaseButtonComponent {
  constructor(private readonly dialog: MatDialog) {}

  agInit(): void {}
  createManualCase(): void {
    this.dialog.open(CreateManualCaseComponent, {
      width: '70%',
      height: '95%',
    });
  }
}
