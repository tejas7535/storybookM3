import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';

import { ProcessCaseState } from '../core/store/reducers/process-case/process-case.reducer';
import {
  getQuotation,
  getUpdateLoading,
  isCustomerLoading,
  isQuotationLoading,
} from '../core/store/selectors';
import { Quotation } from '../shared/models';

@Component({
  selector: 'gq-case-view',
  templateUrl: './process-case-view.component.html',
  styleUrls: ['./process-case-view.component.scss'],
})
export class ProcessCaseViewComponent implements OnInit {
  public quotation$: Observable<Quotation>;
  public isCustomerLoading$: Observable<boolean>;
  public isQuotationLoading$: Observable<boolean>;
  public isUpdateLoading$: Observable<boolean>;

  constructor(private readonly store: Store<ProcessCaseState>) {}

  public ngOnInit(): void {
    this.quotation$ = this.store.pipe(select(getQuotation));
    this.isCustomerLoading$ = this.store.pipe(select(isCustomerLoading));
    this.isQuotationLoading$ = this.store.pipe(select(isQuotationLoading));
    this.isUpdateLoading$ = this.store.pipe(select(getUpdateLoading));
  }
}
