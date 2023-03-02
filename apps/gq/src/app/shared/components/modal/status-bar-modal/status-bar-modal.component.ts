import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import {
  getQuotationCurrency,
  userHasGPCRole,
  userHasSQVRole,
} from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { StatusBar } from '../../../models';
import { EditingModalComponent } from '../editing-modal/editing-modal.component';

@Component({
  selector: 'gq-status-bar-modal',
  templateUrl: './status-bar-modal.component.html',
})
export class StatusBarModalComponent implements OnInit {
  showGPI$: Observable<boolean>;
  showGPM$: Observable<boolean>;
  quotationCurrency$: Observable<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public statusBar: StatusBar,
    private readonly dialogRef: MatDialogRef<EditingModalComponent>,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.showGPI$ = this.store.pipe(userHasGPCRole);
    this.showGPM$ = this.store.pipe(userHasSQVRole);
    this.quotationCurrency$ = this.store.select(getQuotationCurrency);
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
