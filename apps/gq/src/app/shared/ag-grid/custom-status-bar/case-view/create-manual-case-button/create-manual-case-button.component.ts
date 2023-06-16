import { Component, OnDestroy } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { CreateManualCaseComponent } from '@gq/case-view/case-creation/create-manual-case/create-manual-case.component';

@Component({
  selector: 'gq-create-manual-case',
  templateUrl: './create-manual-case-button.component.html',
})
export class CreateManualCaseButtonComponent implements OnDestroy {
  constructor(private readonly dialog: MatDialog) {}

  agInit(): void {}
  createManualCase(): void {
    this.dialog.open(CreateManualCaseComponent, {
      width: '70%',
      height: '95%',
    });
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
