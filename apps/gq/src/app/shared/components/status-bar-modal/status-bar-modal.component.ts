import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getCustomerCurrency,
  userHasGPCRole,
  userHasSQVRole,
} from '../../../core/store';
import { StatusBar } from '../../models';
import { EditingModalComponent } from '../editing-modal/editing-modal.component';

@Component({
  selector: 'gq-status-bar-modal',
  templateUrl: './status-bar-modal.component.html',
})
export class StatusBarModalComponent implements OnInit {
  showGPI$: Observable<boolean>;
  showGPM$: Observable<boolean>;
  customerCurrency$: Observable<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public statusBar: StatusBar,
    private readonly dialogRef: MatDialogRef<EditingModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.showGPI$ = this.store.select(userHasGPCRole);
    this.showGPM$ = this.store.select(userHasSQVRole);
    this.customerCurrency$ = this.store.select(getCustomerCurrency);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
