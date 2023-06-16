import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';

import { Observable } from 'rxjs';

import { getQuotationCurrency } from '@gq/core/store/active-case/active-case.selectors';
import { userHasGPCRole, userHasSQVRole } from '@gq/core/store/selectors';
import { Store } from '@ngrx/store';

import { StatusBar } from '../../../models';

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
    private readonly dialogRef: MatDialogRef<StatusBarModalComponent>,
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
