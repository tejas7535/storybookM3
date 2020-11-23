import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss'],
})
export class CaseViewComponent implements OnDestroy {
  constructor(public dialog: MatDialog) {}
  rowData: any = [];

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
  openCreateCaseDialog(): void {
    this.dialog.open(CreateCaseDialogComponent, {
      width: '70%',
      height: '90%',
    });
  }
}
