import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import {
  getQuotations,
  isDeleteLoading,
  isQuotationsLoading,
} from '../core/store';
import { ViewQuotation } from './models/view-quotation.model';

@Component({
  selector: 'gq-case-view',
  templateUrl: './case-view.component.html',
})
export class CaseViewComponent implements OnInit {
  public quotations$: Observable<ViewQuotation[]>;
  public quotationsLoading$: Observable<boolean>;
  public deleteLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.quotations$ = this.store.select(getQuotations);
    this.quotationsLoading$ = this.store.select(isQuotationsLoading);
    this.deleteLoading$ = this.store.select(isDeleteLoading);
  }
}
