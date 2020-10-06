import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
})
export class CaseViewComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.openDialog();
  }

  openDialog(): void {
    this.dialog.open(CreateCaseDialogComponent, {
      width: '70%',
      height: '90%',
    });
  }
}
