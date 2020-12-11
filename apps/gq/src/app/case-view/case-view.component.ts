import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import {
  getQuotations,
  isDeleteLoading,
  isQuotationsLoading,
} from '../core/store';
import { ViewQuotation } from '../core/store/models';
import { ViewCasesState } from '../core/store/reducers/view-cases/view-cases.reducer';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss'],
})
export class CaseViewComponent implements OnDestroy, OnInit {
  public quotations$: Observable<ViewQuotation[]>;
  public quotationsLoading$: Observable<boolean>;
  public deleteLoading$: Observable<boolean>;

  constructor(
    public dialog: MatDialog,
    private readonly store: Store<ViewCasesState>
  ) {}

  ngOnInit(): void {
    this.quotations$ = this.store.pipe(select(getQuotations));
    this.quotationsLoading$ = this.store.pipe(select(isQuotationsLoading));
    this.deleteLoading$ = this.store.pipe(select(isDeleteLoading));
  }

  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
  openCreateCaseDialog(): void {
    this.dialog.open(CreateCaseDialogComponent, {
      width: '70%',
      height: '95%',
    });
  }
}
