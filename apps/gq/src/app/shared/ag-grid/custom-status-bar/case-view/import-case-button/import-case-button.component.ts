import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ImportCaseComponent } from '@gq/case-view/case-creation/import-case/import-case.component';

@Component({
  selector: 'gq-import-case',
  templateUrl: './import-case-button.component.html',
  standalone: false,
})
export class ImportCaseButtonComponent implements OnDestroy {
  constructor(private readonly dialog: MatDialog) {}
  agInit() {}
  importCase(): void {
    this.dialog.open(ImportCaseComponent, {
      // aligned with UX. we will have some changes later see GQUOTE-6175
      width: '550px',
      height: '238px',
    });
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
