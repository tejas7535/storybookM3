import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { ImportCaseComponent } from '@gq/case-view/case-creation/import-case/import-case.component';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'gq-import-case',
  templateUrl: './import-case-button.component.html',
  imports: [CommonModule, MatButtonModule, TranslocoModule],
})
export class ImportCaseButtonComponent implements OnDestroy {
  private readonly dialog: MatDialog = inject(MatDialog);
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
