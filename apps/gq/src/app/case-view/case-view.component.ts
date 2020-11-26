import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { getQuotations } from '../core/store';
import { ViewQuotation } from '../core/store/models';
import { ViewCasesState } from '../core/store/reducers/view-cases/view-cases.reducers';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
  styleUrls: ['./case-view.component.scss'],
})
export class CaseViewComponent implements OnDestroy, OnInit {
  public quotations$: Observable<ViewQuotation[]>;

  constructor(
    public dialog: MatDialog,
    private readonly store: Store<ViewCasesState>
  ) {}

  ngOnInit(): void {
    this.quotations$ = this.store.pipe(select(getQuotations));
  }

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
