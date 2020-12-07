import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { MaterialTableItem } from '../../core/store/models';
import { ProcessCaseState } from '../../core/store/reducers/process-case/process-case.reducer';
import { getAddMaterialRowData } from '../../core/store/selectors';

@Component({
  selector: 'gq-add-material-dialog',
  templateUrl: './add-material-dialog.component.html',
  styleUrls: ['./add-material-dialog.component.scss'],
})
export class AddMaterialDialogComponent implements OnInit {
  rowData$: Observable<MaterialTableItem[]>;

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly dialogRef: MatDialogRef<AddMaterialDialogComponent>
  ) {}

  public ngOnInit(): void {
    this.rowData$ = this.store.pipe(select(getAddMaterialRowData));
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
