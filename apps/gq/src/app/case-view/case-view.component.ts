import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
})
export class CaseViewComponent implements OnInit, OnDestroy {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.openDialog();
  }
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
  openDialog(): void {
    this.dialog.open(CreateCaseDialogComponent, {
      width: '70%',
      height: '90%',
    });
  }
}
