import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { addMaterials, getAddMaterialRowDataValid } from '../../../core/store';
import { ProcessCaseState } from '../../../core/store/reducers/process-case/process-case.reducer';
import { AddMaterialDialogComponent } from '../../../process-case-view/add-material-dialog/add-material-dialog.component';

@Component({
  selector: 'gq-create-case-button',
  templateUrl: './add-material-button.component.html',
  styleUrls: ['./add-material-button.component.scss'],
})
export class AddMaterialButtonComponent implements OnInit {
  createCaseEnabled$: Observable<boolean>;

  constructor(
    private readonly store: Store<ProcessCaseState>,
    private readonly dialogRef: MatDialogRef<AddMaterialDialogComponent>
  ) {}

  ngOnInit(): void {
    this.createCaseEnabled$ = this.store.pipe(
      select(getAddMaterialRowDataValid)
    );
  }

  addMaterial(): void {
    this.store.dispatch(addMaterials());
    this.dialogRef.close();
  }

  agInit(): void {}
}
